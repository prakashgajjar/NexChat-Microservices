import jwt from "jsonwebtoken";

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
    const isDev = process.env.NODE_ENV === "development";

    // Send access token in cookie OR json
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: !isDev, // secure only in production
      sameSite: isDev ? "lax" : "none",
      maxAge: 30 * 60 * 1000,
      path: "/",
    });

    return res.json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};
