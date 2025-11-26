import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

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
