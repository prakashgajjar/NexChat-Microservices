import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.json({
      status: 401,
      success: false,
      message: "No token in cookies",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.json({
      status: 401,
      success: false,
      message: "Token invalid or expired",
    });
  }
};
