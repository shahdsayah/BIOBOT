require("dotenv").config();

const mongoose = require("mongoose");

async function testConnection() {
  try {
    console.log("MONGO_URI exists:", process.env.MONGO_URI ? "YES" : "NO");

    if (!process.env.MONGO_URI) {
      console.log("MONGO_URI is missing from .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected Successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log("MongoDB Test Error:");
    console.log(error.message);
    process.exit(1);
  }
}

testConnection();