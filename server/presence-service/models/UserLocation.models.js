const UserLocation = new mongoose.Schema({
  userId: { type: String, unique: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }
  },
  updatedAt: { type: Date, default: Date.now }
});

UserLocation.index({ location: "2dsphere" });
