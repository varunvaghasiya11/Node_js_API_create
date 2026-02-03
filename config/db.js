const mongoose = require("mongoose");

const DB = async () => {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = DB;
