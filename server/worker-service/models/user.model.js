import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  googleId: { type: String },
  password: { type: String }, // if normal signup supported
  publicKey: { type: String, required: true },
  privateKeyEncrypted: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  }
});

userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
