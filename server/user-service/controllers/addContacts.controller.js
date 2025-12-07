import UserProfile from "../models/UserProfile.models.js";

export const addContact = async (req, res) => {
  try {
    const { userId, contactId } = req.body;

    if (!userId || !contactId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or contactId",
      });
    }

    // Prevent self contact
    if (userId === contactId) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself as a contact",
      });
    }

    // Find both users
    const user = await UserProfile.findOne({ userId });
    const contactUser = await UserProfile.findOne({ userId: contactId });

    if (!user || !contactUser) {
      return res.status(404).json({
        success: false,
        message: "One or both users not found",
      });
    }

    // Check if already added (correct ObjectId comparison)
    const alreadyInUser =
      user.contacts.some((id) => id.equals(contactUser._id));

    const alreadyInContact =
      contactUser.contacts.some((id) => id.equals(user._id));

    // Add if missing
    if (!alreadyInUser) user.contacts.push(contactUser._id);
    if (!alreadyInContact) contactUser.contacts.push(user._id);

    // Save both
    await user.save();
    await contactUser.save();

    return res.json({
      success: true,
      message: "Contacts added successfully for both users",
    });
  } catch (err) {
    console.error("Add contact error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
