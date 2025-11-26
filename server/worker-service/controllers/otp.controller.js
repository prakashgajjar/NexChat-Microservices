// import { OTP } from "../models/otp.model.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";
import redis from "../configs/redis.config.js";

export const sendOtp = async (req, res) => {
  try {
    const { contact } = req.body;
    const otp = generateOtp();
    // await OTP.create({ contact, otp, expiresAt: Date.now() + 2 * 60 * 1000 });
    await redis.set(`otp:${contact}`, otp, { EX: 300 });
    await sendEmail(contact, "Verification Code", `Your OTP is ${otp}`);
    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
