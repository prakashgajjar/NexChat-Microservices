import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  contact: String, // email or phone
  otp: String,
  expiresAt: { type: Date, index: { expires: "5m" } }
});

export const OTP = mongoose.model("OTP", otpSchema);
