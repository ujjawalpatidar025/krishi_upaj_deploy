const User = require("../../Models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isEmail, isStrongPassword } = require("validator");

//SignUp Controller

const signup = async (req, resp) => {
  const { username } = req.body;
  const userpassword = req.body.password;

  //console.log(req.body);

  try {
    if (!username || !userpassword)
      return resp
        .status(400)
        .json({ status: "false", message: "Fill all the necessary fields" });

    const isUser = await User.findOne({ username });

    if (isUser)
       return resp
        .status(400)
        .json({ status: "false", message: "Email Already Exists" });

    //validations
    if (!isEmail(username))
       return resp.status(400).json({ status: "false", message: "Not a valid Email" });
    if (!isStrongPassword(userpassword))
      return resp
        .status(400)
        .json({ status: "false", message: "Not enought Strong Password" });
    else {
      const salt = bcrypt.genSalt(10);
      const hash = await bcrypt.hash(userpassword, 10);

      const user = new User({ username, password: hash });
      await user.save();

      if (!user)
         return resp
          .status(500)
          .json({ status: "false", message: "Internal Server Error" });

      //creating jwt token
      const { password, ...others } = user._doc;
      const token = jwt.sign({ _id: user._id }, process.env.JWTTOKENKEY);
       return resp
        .status(200)
        .json({
          status: "true",
          message: "SignUp Successfully",
          token,
          others,
        });
    }
  } catch (err) {
    console.log(err);
    return resp.status(500).json({ status: "false", message: err });
  }
};

//SignIn Controller

const signin = async (req, resp) => {
  try {
    const { username } = req.body;
    const userpassword = req.body.password;

    //validations

    if (!username || !userpassword)
       return resp
        .status(400)
        .json({ status: "false", message: "Fill all the necessary fields" });

    const user = await User.findOne({ username });
    if (!user)
       return resp.status(404).json({ status: "false", message: "User Not Found" });

    const isCorrectPassword = await bcrypt.compare(userpassword, user.password);
    if (!isCorrectPassword)
       return resp
        .status(401)
        .json({ status: "false", message: "Invalid Credentials" });

    const token = jwt.sign({ _id: user._id }, process.env.JWTTOKENKEY);
    const { password, ...others } = user._doc;
    //console.log(others);
     return resp
      .status(200)
      .json({ status: "true", message: "Login Success", token, others });
  } catch (err) {
    console.log(err);
     return resp.status(500).json({ status: "false", message: err });
  }
};

//Update Controller
const updateUser = async (req, resp) => {
  const { _id, firstname, lastname, address, pincode, phonenumber, username } =
    req.body;

  try {
    if (!firstname || !lastname || !address || !pincode || !phonenumber)
      return resp
        .status(404)
        .json({ status: "false", message: "Fill all necessary Details" });

    const response = await User.updateOne(
      { _id },
      {
        $set: {
          firstname,
          lastname,
          address,
          pincode,
          phonenumber,
          isUpdate: true,
        },
      }
    );

    if (!response)
       return resp
        .status(500)
        .json({ status: "false", message: "Internal Server Error" });

     return resp
      .status(200)
      .json({ status: "true", message: "Profile Updated Successfully" });
  } catch (err) {
    console.log(err);
     return resp.status(500).json({ status: "false", message: err });
  }
};

//IsAuthenticated Controller

const isAuthenticated = async (req, resp) => {
  try {
    const userdata = await User.findById(req.user._id);
    
    const { password, ...others } = userdata._doc;

    if (!userdata)
       return resp
        .status(404)
        .json({ status: "false", message: "You are not logged in..." });

     return resp.status(200).json({
      success: "true",
      message: "You are Authenticated",
      others,
    });
  } catch (err) {
    console.log(err);
     return resp.status(500).json({ status: "false", message: err });
  }
};

//Get User

const getUser = async (req, resp) => {
  const { _id } = req.body;
  try {
    const user = await User.findById({ _id });
    const { password, ...others } = user._doc;
    if (!user)
       return resp.status(409).json({ status: "false", message: "User not Found" });

   return resp.status(200).json({ status: "true", message: "User Found", others });
  } catch (err) {
    console.log(err);
    return resp.status(500).json({ status: "false", message: err });
  }
};

module.exports = { signup, signin, isAuthenticated, updateUser, getUser };
