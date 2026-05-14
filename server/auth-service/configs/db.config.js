import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_AUTH_SERVICES_URI || process.env.MONGO_AUTH_SERVICES_URL;
    console.log(`->>>Attempting MongoDB connection with URI: ${mongoUri}`);
    const conn = await mongoose.connect(mongoUri);

    console.log(`->>>MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`->>>MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.log("->>>MongoDB disconnected. Trying to reconnect...");
  });
};

export default connectDB;
