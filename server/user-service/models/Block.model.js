import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },

  // users THIS user has blocked
  blockedUsers: [
    {
      userId: String,
      blockedAt: { type: Date, default: Date.now }
    }
  ],

  // users who blocked THIS user
  blockedBy: [
    {
      userId: String,
      blockedAt: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("Block", BlockSchema);
