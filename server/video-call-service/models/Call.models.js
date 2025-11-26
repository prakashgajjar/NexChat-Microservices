const Call = new mongoose.Schema({
  callId: { type: String, unique: true },
  callerId: { type: String, required: true },
  receiverId: { type: String, required: true },

  type: { type: String, enum: ["audio", "video"], required: true },
  status: { type: String, enum: ["ringing", "accepted", "rejected", "ended"], default: "ringing" },

  startedAt: { type: Date },
  endedAt: { type: Date }
});
