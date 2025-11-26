import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.includes(token))
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccess = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.json({ accessToken: newAccess });
  } catch (err) {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};
