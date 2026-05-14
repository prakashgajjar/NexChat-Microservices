import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshTokenSchema.models.js";
import { hashToken, generateJti } from "../utils/Token.js";

export const refresh = async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;
    // console.log(oldToken)

    if (!oldToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    //Verify JWT
    const decoded = jwt.verify(
      oldToken,
      process.env.JWT_REFRESH_SECRET
    );

    const tokenHash = hashToken(oldToken);

    // console.log(tokenHash)

    //Find token in DB
    const storedToken = await RefreshToken.findOne({
      jti: decoded.jti,
      tokenHash,
      revoked: false,
    });

    // console.log(storedToken)

    if (!storedToken) {
      return res.status(403).json({ message: "Refresh token reused or revoked" });
    }

    // Revoke OLD refresh token
    storedToken.revoked = true;
    await storedToken.save();

    //Generate NEW access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    //Generate NEW refresh token (ROTATED)
    const newJti = generateJti();
    const newRefreshToken = jwt.sign(
      {
        userId: decoded.userId,
        jti: newJti,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Store NEW refresh token in DB
    await RefreshToken.create({
      userId: decoded.userId,
      jti: newJti,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      device: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    const isDev = process.env.NODE_ENV === "development";

    // Send cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "lax" : "none",
      maxAge: 30 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      message: "Tokens refreshed (rotated)",
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};
