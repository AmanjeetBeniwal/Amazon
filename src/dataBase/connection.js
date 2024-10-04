const mongoose = require("mongoose");
const Db_Name = require("../utils/constant.js");

const connect = async () => {
  try {
    const uri = `${process.env.MONGODB_URI}/${Db_Name}`;
    console.log(uri);
    
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri)
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

module.exports = connect;
