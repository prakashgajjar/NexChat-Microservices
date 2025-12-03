import Message from "../models/Message.models.js";
import Chat from "../models/Chat.models.js";

const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params || {};
        const { senderId } = req.query || {}; // optional filter

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "chatId is required"
            });
        }

        // Check if chat exists
        const chat = await Chat.findOne({ chatId });
       	if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        // Build query
        const query = { chatId };

        if (senderId) {
            query.senderId = senderId;
        }

        // Fetch all messages for this chat
        const messages = await Message.find(query).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            data: messages
        });

    } catch (err) {
        console.error("getMessages error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default getMessages;
