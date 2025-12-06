import User from "../models/UserProfile.models.js";

// Set or update username
export const setUsername = async (req, res) => {
  try {
    const userId = req.user.userId; // custom userId
    let { username } = req.body;

    console.log("Setting username for userId:", userId, "to", username);

    if (!username || typeof username !== "string") {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    username = username.trim().toLowerCase();

    if (username.length < 6 || username.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be 6-20 characters long",
      });
    }

    // Check if user exists by custom userId
    const existingUser = await User.findOne({ userId });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if username is taken by another user
    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername.userId !== userId) {
      return res.status(409).json({
        success: false,
        message: "Username already taken",
      });
    }

    // Update user by custom userId
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { username },
      { new: true }
    );

    console.log("Updated user:", updatedUser);

    return res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error updating username:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};
