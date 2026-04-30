const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    process.env.DATABASE_URL;

  if (!mongoUri) {
    throw new Error("MongoDB connection string is required. Set MONGO_URI, MONGODB_URI, MONGO_URL, or DATABASE_URL.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
