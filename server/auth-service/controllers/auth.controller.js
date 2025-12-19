import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/AuthUser.models.js";
import RefreshToken from "../models/RefreshTokenSchema.models.js";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
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
      status: 200,
      userId: user._id,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
