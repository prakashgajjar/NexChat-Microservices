const ChatPreferences = new mongoose.Schema({
  userId: { type: String, required: true },
  chatId: { type: String, required: true },
  theme: { type: String, default: "default" },
  backgroundUrl: { type: String, default: null },
  bubbleColor: { type: String, default: "#4f46e5" },
  font: { type: String, default: "default" }
});
