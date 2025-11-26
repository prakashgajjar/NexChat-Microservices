import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, unique: true },

  userId: { type: String, required: true }, // who will receive this notification
  type: {
    type: String,
    enum: [
      "message",
      "call",
      "story",
      "friend_request",
      "nearby_user",
      "system"
    ],
    required: true
  },

  title: { type: String },
  body: { type: String },

  relatedId: { type: String },  
  // Example:
  // messageId for message
  // callId for call
  // storyId for story

  sentAt: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false }
});

export default mongoose.model("Notification", notificationSchema);
