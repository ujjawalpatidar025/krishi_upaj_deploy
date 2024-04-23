const Machine = require("../../Models/Machine.js");
const UserMachine = require("../../Models/UserMachine.js");
const MachineRequest = require("../../Models/MachineRequest.js");
const cloudinary = require('cloudinary').v2;

// Add machines Controller

const addMachine = async (req, resp) => {
  const { _id, title, type, shortdescription, description, year, rentamount } =
    req.body;

    const image = req.file.path;
  

  try {
    if (
      !title ||
      !type ||
      !shortdescription ||
      !description ||
      !year ||
      !rentamount ||
      !image
    )
      return resp
        .status(400)
        .json({ status: "false", message: "Fill all the Necessary Details" });

        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'uploads' });
       const imageUrl = result?.url;
    

    const machine = new Machine({
      sellerid: _id,
      title,
      type,
      shortdescription,
      description,
      year,
      rentamount,
      image:imageUrl,
      status: true,
    });

    await machine.save();
    // console.log(machine);
    if (!machine)
      return resp
        .status(500)
        .json({ status: "false", message: "Internal Server Error" });

    const isCreated = await UserMachine.findOne({ userid: _id });
    // console.log(isCreated);
    const owned = [
      {
        machineid: machine._id,
        machinename: machine.title,
        status: true,
      },
    ];
    if (!isCreated) {
      const createdMachine = new UserMachine({
        userid: _id,
        owned,
      });
      await createdMachine.save();
    } else {
      const response = await UserMachine.updateOne(
        { userid: _id },
        {
          $push: {
            owned: {
              machineid: machine._id,
              machinename: machine.title,
              status: true,
            },
          },
        }
      );
    }

    return resp
      .status(200)
      .json({ status: "true", message: "Machine Added Successfully" });
  } catch (err) {
    console.log(err);
    return resp
      .status(500)
      .json({ status: "false", message: err.response.data.message });
  }
};

//Update status Machines

const updateStatus = async (req, resp) => {
  const { _id, status } = req.body;
  try {
    var newStatus;
    if (status == false) {
      newStatus = true;
    } else {
      newStatus = false;
    }

    const response = await Machine.updateOne(
      { _id },
      {
        $set: {
          status: newStatus,
        },
      }
    );

    if (!response) {
      return resp
        .status(400)
        .json({ status: "false", message: "Internal Server Error" });
    }
    return resp
      .status(200)
      .json({ status: "true", message: "Machine Status Updated Successfully" });
  } catch (err) {
    console.log(err);
    return resp
      .status(500)
      .json({ status: "false", message: err.response.data.message });
  }
};

//update Amount controller

const updateAmount = async (req, resp) => {
  const { _id, rentamount } = req.body;
  try {
    const response = await Machine.updateOne(
      { _id },
      {
        $set: {
          rentamount,
        },
      }
    );

    if (!response) {
      return resp
        .status(400)
        .json({ status: "false", message: "Internal Server Error" });
    }
    return resp
      .status(200)
      .json({ status: "true", message: "Machine Amount Updated Successfully" });
  } catch (err) {
    console.log(err);
    return resp
      .status(500)
      .json({ status: "false", message: err.response.data.message });
  }
};

//get machine

const getMachine = async (req, resp) => {
  try {
    const machines = await Machine.find();
    if (!machines) {
     return  resp
        .status(500)
        .json({ status: "false", message: "Internal Server Error" });
    } else {
      return resp
        .status(200)
        .json({
          status: "true",
          message: "Machines Listed Successfully",
          machines,
        });
    }
  } catch (err) {
    console.log(err);
    return resp
      .status(500)
      .json({ status: "false", message: err.response.data.message });
  }
};


//get machine with Machine ID 


const getMachinebyId = async(req,resp)=>{
  const {machineid} = req.body;
  try{

    const data = await Machine.findById({_id:machineid});

    if(!data)
    {
      return resp.status(401).json({status:'false',message:'Machine Not found'});

    }
    else{
      return resp.status(200).json({status:'true',message:"Machine Found", data});
    }

  }
  catch(err)
  {
    console.log(err);
    return resp
      .status(500)
      .json({ status: "false", message: err.response.data.message });
  }
}

//get UserMachine Status with User id 


const getUserMachine  = async(req,resp)=>{
    const {userid} = req.body;
    try{
      const usermachine= await UserMachine.find({userid});
      if(!usermachine)
      {
        return resp.status(400).json({status:'false',message:"User Info Not found"});
      }
      else{
        return resp.status(200).json({status:'true',message:"User Record Found",usermachine});
      }
    }
    catch(err)
    {
      console.log(err);
      return resp.status(500).json({status:'false',message:err.response.data.message});

    }
}

module.exports = { addMachine, updateStatus, updateAmount, getMachine ,getUserMachine,getMachinebyId };
