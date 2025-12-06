import User from "../models/UserProfile.models.js";

export const checkUsername = async (req, res) => {
  try {
    let { username } = req.body;

    if (!username || typeof username !== "string") {
      return res.status(400).json({
        success: false,
        message: "Username is required",
        available: false,
      });
    }

    username = username.trim().toLowerCase();

    // Validate format (same as frontend)
    const isValid = /^[A-Za-z0-9._]{6,20}$/.test(username);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Username must be 6–20 chars, letters/numbers/._ only",
        available: false,
      });
    }

    // Check if username exists
    const existing = await User.findOne({ username });

    if (existing) {
      return res.status(200).json({
        success: true,
        available: false,
        message: "Username already taken",
      });
    }

    return res.status(200).json({
      success: true,
      available: true,
      message: "Username is available",
    });

  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while checking username",
      available: false,
    });
  }
};
