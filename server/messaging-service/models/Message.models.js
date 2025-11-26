const Message = new mongoose.Schema({
  messageId: { type: String, unique: true },
  chatId: { type: String, required: true },
  senderId: { type: String, required: true },

  // End-to-end encrypted content
  cipherText: { type: String, required: true },
  iv: { type: String, required: true },
  encryptedKey: { type: String, required: true },

  // Scheduling
  scheduledAt: { type: Date, default: null },

  // Self-destruct feature
  expiresAt: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now }
});


export default mongoose.model("Message", Message);
