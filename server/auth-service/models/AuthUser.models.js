import mongoose from "mongoose";

const AuthUser = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AuthUser", AuthUser);
