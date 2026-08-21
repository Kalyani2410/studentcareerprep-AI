const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("MONGO_URI loaded:", process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@') : "MISSING");
    await mongoose.connect(process.env.MONGO_URI); // <-- must be process.env.MONGO_URI, not a hardcoded string
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;