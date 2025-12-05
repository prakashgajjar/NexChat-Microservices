import Message from "../models/Message.models.js";
import Chat from "../models/Chat.models.js";

const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    console.log(receiverId)
    const userId = req.user.userId;

    console.log("getMessages called with userId:", userId, "receiverId:", receiverId);

    if (!receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "receiverId is required" });
    }
    const makeDmId = (a, b) => {
      const [x, y] = [a, b].map(String).sort();
      return `dm-${x}-${y}`;
    };

    const chatId =  makeDmId(userId, receiverId);
    console.log(chatId)
    
    const chat = await Chat.findOne({ chatId });
    console.log("chat found:", chat);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.error("getMessages error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default getMessages;
