import User from "../models/UserProfile.models.js";
export const updateChatBgUrl = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const { chatBgUrl } = req.body;
    console.log("chnage bg page " , chatBgUrl)
    
    if (!chatBgUrl || typeof chatBgUrl !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid chatBgUrl is required",
      });
    }

    // Optional: basic URL validation
    try {
      new URL(chatBgUrl);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      });
    }

    const user = await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          "ui.chatBgUrl": chatBgUrl,
        },
      },
      { new: true }
    ).select("ui.chatBgUrl");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat background updated successfully",
      chatBgUrl: user.ui.chatBgUrl,
    });
  } catch (error) {
    console.error("Update Chat BG Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
