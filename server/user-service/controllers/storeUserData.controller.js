import UserKeys from "../models/UserKeys.models.js";
import { generateAllKeys } from "../utils/generateKeys.utils.js";
import User from "../models/UserProfile.models.js";

export const storeUserData = async (req, res) => {
  try {
    const { data } = req.body;

    // Extract REQUIRED fields from incoming data
    const { userId, email, username } = data;

    if (!userId || !email || !username) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (userId, email, username)",
      });
    }

    console.log("Storing keys for:", { userId, email, username });

    // Check if keys already exist
    const existingKeys = await UserKeys.findOne({ userId });
    const existingUser = await User.findOne({ userId });

    if (existingKeys && existingUser) {
      return res.status(200).json({
        success: true,
        message: "Keys already exist",
        keys: existingKeys,
        user: existingUser,
      });
    }

    let createdUser = null;

    // Create a new user profile if not exists
    if (!existingUser) {
      createdUser = await User.create({
        userId,
        username,
        email,
      });

      if (!createdUser) {
        return res.status(500).json({
          success: false,
          message: "User profile creation failed",
        });
      }
    }

    // Generate full key bundle
    const keyBundle = generateAllKeys(userId);

    // Save keys in DB
    const savedKeys = await UserKeys.create(keyBundle);

    try {
      createdUser.identityPublicKey = keyBundle.identityPublicKey;
      await createdUser.save();
    } catch (error) {
      console.error("Error saving identity public key to user profile:", error);
    }

    return res.status(201).json({
      success: true,
      message: "Keys generated & stored successfully",
      data: {
        savedKeys,
        user: createdUser || existingUser,
      },
    });
  } catch (error) {
    console.error("Error creating user keys:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate/store keys",
      error: error.message,
    });
  }
};
