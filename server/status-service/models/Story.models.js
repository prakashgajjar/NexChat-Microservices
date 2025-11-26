const Story = new mongoose.Schema({
  storyId: { type: String, unique: true },
  userId: { type: String, required: true },

  type: { type: String, enum: ["image", "video", "text"], required: true },
  contentUrl: { type: String },
  text: { type: String },

  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }  // usually +24 hours
});
