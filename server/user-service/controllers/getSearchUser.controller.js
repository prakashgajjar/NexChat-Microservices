import User from "../models/UserProfile.models.js";

const getAllSearchedUsers = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username || username.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const query = username.trim();

    //Search by username OR fullname
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullname: { $regex: query, $options: "i" } }
      ]
    })
    .limit(20)
    .lean();

    if (users.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No users found",
        data: [],
      });
    }

    return res.json({
      success: true,
      data: users,
    });

  } catch (err) {
    console.error("getUser:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default getAllSearchedUsers;
