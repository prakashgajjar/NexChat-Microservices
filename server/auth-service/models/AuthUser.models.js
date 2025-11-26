import mongoose from "mongoose";

const AuthUser = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  username:{type : String},
  createdAt: { type: Date, default: Date.now },
  verified:{
    type:Boolean,
    default:false
  }
});

export default mongoose.model("AuthUser", AuthUser);
