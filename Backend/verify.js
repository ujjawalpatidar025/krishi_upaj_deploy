const jwt = require("jsonwebtoken");

const verifyToken = (req, resp, next) => {
  const token = req.body.token;
  /// console.log(token);
  if (!token)
    return resp.status(404).json({ status: "false", message: "Token not found" });

    
  jwt.verify(token, process.env.JWTTOKENKEY, (err, user) => {
    if (err)
      return resp.status(403).json({ status: "false", message: "Invalid Token" });

    // if(!user)
    // {
    //   return resp.status(400).json({status:'false',message:"User not Found"});

    // }
    req.user = user;
    req.token = token;
    next();
  });
};

module.exports = verifyToken;
