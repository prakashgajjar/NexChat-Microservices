const Presence = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["online", "offline"], default: "offline" },
  lastSeen: { type: Date, default: Date.now }
});
