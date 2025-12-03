import User from "../models/UserProfile.models.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    return res.json({ success: true, data: users });
  } catch (err) {
    console.error("getAllUsers:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default getAllUsers;