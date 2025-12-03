 import User from "../models/UserProfile.models.js"; 
 const getPublicKey = async (req, res) => {
  try {
    const  userId  = req.params.userId;
    const user = await User.findOne({ userId }).lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, publicKey: user.publicKey });
  } catch (err) {
    console.error("getPublicKey:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default getPublicKey;