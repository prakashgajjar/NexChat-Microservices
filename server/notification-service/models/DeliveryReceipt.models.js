import mongoose from "mongoose";

const deliveryReceiptSchema = new mongoose.Schema({
  notificationId: { type: String, required: true },
  userId: { type: String, required: true },

  status: {
    type: String,
    enum: ["sent", "delivered", "seen", "failed"],
    default: "sent"
  },

  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("DeliveryReceipt", deliveryReceiptSchema);
