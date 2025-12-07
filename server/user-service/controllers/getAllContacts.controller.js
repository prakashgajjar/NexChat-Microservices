import UserProfile from "../models/UserProfile.models.js";

export const getContacts = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId",
      });
    }

    // Populate contacts (only select needed fields)
    const user = await UserProfile.findOne({ userId }).populate({
      path: "contacts",
      select: "userId username fullname",
    })

    console.log("Fetched user contacts:", user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      status: 200,
      success: true,
      data: user?.contacts || [],
    });
  } catch (err) {
    console.error("Get contacts error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
