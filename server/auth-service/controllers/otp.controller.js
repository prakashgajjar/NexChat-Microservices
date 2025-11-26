import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";
import redis from "../configs/redis.config.js";

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const otp = generateOtp();

    await redis.set(`otp:${email}`, otp, { EX: 300 });

    if (process.env.NODE_ENV !== "production") {
      console.log("Generated OTP:", otp);
    }

    const mail = await sendEmail(
      email,
      "Verification Code",
      `Your OTP is ${otp}`
    );

    if (process.env.NODE_ENV !== "production") {
      console.log("mail :", mail);
    }

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("OTP error:", err.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};
