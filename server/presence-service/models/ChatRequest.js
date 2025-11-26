const ChatRequest = new mongoose.Schema({
  requestId: { type: String, unique: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ChatRequest", ChatRequest);
