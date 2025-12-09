import bcrypt from "bcryptjs";
import User from "../models/AuthUser.models.js";
import redis from "../configs/redis.config.js";
import axios from "axios";
import jwt from "jsonwebtoken";

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, fullname, password } = req.body;
    console.log(email, otp, fullname, password);
    if (!email || !otp || !fullname || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // console.log(contact, otp, username, password);
    const storedOtp = await redis.get(`otp:${email}`);
    console.log("stored otp", storedOtp);

    if (!storedOtp) {
      return res.status(400).json({ message: "expired OTP" });
    }

    if (String(storedOtp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hash = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      email: email,
      password: hash,
    });

    const keys = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_USER}/api/keys/store`,
      {
        data: {
          userId: user._id,
          email: email,
          fullname: fullname,
        },
      }
    );

    if (keys.data.success !== true) {
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({ message: "User creation failed" });
    }

    if (!user) {
      return res.status(500).json({ message: "User creation failed" });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 60 * 1000,
      path: "/",
    });

    const theme = user.ui?.theme || "light";
    res.cookie("UUI_theme", theme, {
      // httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 60 * 1000 * 365,
      path: "/",
    });

    res.json({ message: "Signup complete", userId: user._id });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
