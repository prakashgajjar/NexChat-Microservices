import User from "../models/UserProfile.models.js";

const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ userId }).lean();

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error("getUser:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default getMe;
