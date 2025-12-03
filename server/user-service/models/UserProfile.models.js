import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

  // Basic identity
  userId: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  fullname:{type:String},
  email: { type: String },
  phone: { type: String },

  avatar: { type: String },             
  bio: { type: String, default: "" },   

  ui: {
    theme: { type: String, default: "light" }, 
    accentColor: { type: String, default: "#3b82f6" },
    chatWallpaper: { type: String, default: "default" }, 
    fontSize: { type: String, default: "medium" },

    // Chat bubble settings
    chatBubble: {
      myBubbleColor: { type: String, default: "#3b82f6" },
      otherBubbleColor: { type: String, default: "#e5e7eb" }
    }
  },

  contacts: [
    {
      userId: String,
      savedName: String,
      addedAt: { type: Date, default: Date.now }
    }
  ],

  // SETTINGS
  settings: {
    notifications: {
      msgTone: { type: String, default: "default" },
      vibration: { type: Boolean, default: true },
      messagePreview: { type: Boolean, default: true },
      muteAll: { type: Boolean, default: false }
    },

    privacy: {
      lastSeenVisible: { type: Boolean, default: true },
      profilePhotoVisible: { type: Boolean, default: true },
      readReceipts: { type: Boolean, default: true },
      allowScreenshots: { type: Boolean, default: true }
    }
  },

  // BLOCKING SYSTEM
  blockedUsers: [
    {
      userId: String,
      blockedAt: { type: Date, default: Date.now }
    }
  ],

  blockedBy: [
    {
      userId: String,
      blockedAt: { type: Date, default: Date.now }
    }
  ],

  // PRESENCE (optional)
  lastSeen: { type: Date },
  isOnline: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
