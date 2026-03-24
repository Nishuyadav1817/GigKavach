const mongoose = require("mongoose");

const DataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
   
  }
};

module.exports = DataBase;
