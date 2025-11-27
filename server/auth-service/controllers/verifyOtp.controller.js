import bcrypt from "bcryptjs";
import User from "../models/AuthUser.models.js";
import redis from "../configs/redis.config.js";
import axios from "axios";

export const verifyOtp = async (req, res) => {
  try {
    const { contact, otp, username, password } = req.body;
    // console.log(contact, otp, username, password);
    const storedOtp = await redis.get(`otp:${contact}`);
    // console.log("stored otp", storedOtp);

    if (!storedOtp) {
      return res.status(400).json({ message: "expired OTP" });
    }

    if (String(storedOtp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hash = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      email: contact,
      username,
      password: hash,
      verified: true,
    });

    const keys = await axios.post(
      `${process.env.USER_SERVICE_URL}/api/keys/store`,
      {
        userId: user._id,
      }
    );

    if (!keys) {
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({ message: "User creation failed" });
    }

    try {
      await redis.del(`otp:${contact}`);
    } catch (error) {
      console.log(error?.message);
    }

    if (!user) {
      return res.status(500).json({ message: "User creation failed" });
    }

    res.json({ message: "Signup complete", userId: user._id });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
