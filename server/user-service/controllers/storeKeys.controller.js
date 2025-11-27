// controllers/userKeys.controller.js

import UserKeys from "../models/UserKeys.models.js";
import { generateAllKeys } from "../utils/generateKeys.utils.js";

export const storeKeys = async (req, res) => {
  try {
    const { userId } = req.body;

    if (process.env.NODE_ENV !== "production") {
      console.log(userId);
    }

    // Check if keys already exist
    const existing = await UserKeys.findOne({ userId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Keys already exist",
        keys: existing,
      });
    }

    // Generate full key bundle
    const keyBundle = generateAllKeys(userId);

    // Store in DB
    const savedKeys = await UserKeys.create(keyBundle);

    return res.status(201).json({
      success: true,
      message: "Keys generated & stored successfully",
      keys: savedKeys,
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
