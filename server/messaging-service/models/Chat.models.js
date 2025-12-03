import mongoose from "mongoose";


const Chat = new mongoose.Schema({
  chatId: { type: String, unique: true },
  members: [{ type: String }],    // array of userId strings
  isGroup: { type: Boolean, default: false },
  groupName: { type: String },
  admin: { type: String },        // userId
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Chat", Chat);