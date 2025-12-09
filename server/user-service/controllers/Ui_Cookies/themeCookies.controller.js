import User from "../../models/UserProfile.models.js";

export const themeCookies = async (req, res) => {
  const { theme } = await req.body;

  if (!theme) {
    console.error("Theme is required");
    return res.json({
      status: 400,
      success: false,
      message: "Theme is required",
    });
  }

  try {
    const userId = req?.user?.userId;

    console.log("User ID:", userId);

    if (!userId) {
      return res.json({
        status: 403,
        success: false,
        message: "User not authenticated",
      });
    }

    try {
      const user = await User.findByIdAndUpdate(
        {"userId" : userId},
        { "ui.theme": theme },
        { new: true }
      );

      console.log("User theme updated:", user);
    } catch (error) {
      console.error("Error updating in DB user theme:", error);
    }

    res.cookie("UUI_theme", theme, {
      // httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 60 * 1000 * 365,
      path: "/",
    });

    return res.json({
      message: "Theme saved",
      theme: theme,
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error("Error in themeCookies controller:", error);
    return res.json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
};
