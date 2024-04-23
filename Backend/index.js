const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require('path');
const authRoutes = require("./Routes/authRoutes.js");
const machineRoutes = require("./Routes/machineRoutes.js");
const requestRoutes = require("./Routes/requestRoutes.js");
const cloudinary = require('cloudinary').v2;

const app = express();
dotenv.config();
app.use(cors({
  origin: '*',
  credentials: true // If your frontend sends cookies or credentials, set this to true
}));

app.use(express.urlencoded({ extended: false }));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'uploads', // Specify the folder in your Cloudinary account where you want to store the images
//     allowed_formats: ['jpg', 'jpeg', 'png'] // Specify the allowed image formats
//   }
// });

// const upload = multer({ storage: storage });
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5001;


const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})


const upload = multer({ storage });
// Connection to database
const connection = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to DB!");
    })
    .catch((err) => {
      console.log(`Error Not connected! ${err}`);
    });
};

//Routes for app
app.use(express.json());

app.get("/",(req,res)=>{
  res.status(200).json({message:"Server is running...."});
})

app.use("/api/users", authRoutes);
app.use("/api/machines", upload.single("image"), machineRoutes);
app.use("/api/requests", requestRoutes);
// app.use("/messages", verifyToken, messageRoute);
// app.use("/queries", verifyToken, queryRoute);

//middleware for handling error
// app.use((err, req, res, next)=>{
//    const status=err.status || "500";
//    const message=err.message || "Something went wrong";
//    return res.status(status).json({
//     succcess:false,
//     status,
//     message
//    })
// })

// Connection to server on Port
app.listen(PORT, () => {
  connection();
  console.log("connected to Server!");
});


// app.use((req, res, next) => {
//   return res.status(404).json({
//     message: "Route Not Found",
//   })
// });