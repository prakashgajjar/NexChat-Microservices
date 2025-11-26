import mongoose from "mongoose";

const UserProfile = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  username: { type: String, required: true, unique: true },
  avatar: { type: String },
  bio: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },

  //Users THIS user has blocked
  blockedUsers: [
    {
      userId: { type: String },
      blockedAt: { type: Date, default: Date.now }
    }
  ],

  //Users who blocked THIS user
  blockedBy: [
    {
      userId: { type: String },
      blockedAt: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("UserProfile", UserProfile);
