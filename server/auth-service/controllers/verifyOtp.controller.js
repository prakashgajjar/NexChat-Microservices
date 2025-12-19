import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../models/AuthUser.models.js";
import RefreshToken from "../models/RefreshTokenSchema.models.js";
import redis from "../configs/redis.config.js";


const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, fullname, password } = req.body;

    if (!email || !otp || !fullname || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (String(storedOtp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }


    await redis.del(`otp:${email}`);

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hash,
    });

    const keys = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_USER}/api/keys/store`,
      {
        data: {
          userId: user._id,
          email,
          fullname,
        },
      }
    );

    if (!keys.data?.success) {
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({ message: "User creation failed" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    const jti = crypto.randomUUID();

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        jti,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await RefreshToken.create({
      userId: user._id,
      jti,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      device: req.headers["user-agent"],
      ipAddress:
        req.headers["x-forwarded-for"]?.split(",")[0] || req.ip,
    });

    const isDev = process.env.NODE_ENV === "development";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "lax" : "none",
      maxAge: 30 * 60 * 1000,
      path: "/",
    });

    // UI preference cookie
    const theme = user.ui?.theme || "light";
    res.cookie("UUI_theme", theme, {
      secure: !isDev,
      sameSite: isDev ? "lax" : "none",
      maxAge: 365 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      message: "Signup complete",
      userId: user._id,
    });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
