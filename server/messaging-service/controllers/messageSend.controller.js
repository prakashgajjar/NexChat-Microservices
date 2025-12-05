import { randomUUID } from "crypto";
import Message from "../models/Message.models.js";
import Chat from "../models/Chat.models.js";

const messageSend = async (req, res) => {
  try {
    const senderId = req.user.userId;
    console.log(senderId)   // ✔ sender comes from backend auth

    const {
      recipientId,     // ✔ ONLY THIS IS SENT BY FRONTEND
      cipherText,
      iv,
      encryptedKey,
      expiresAt = null,
      scheduledAt = null
    } = req.body;

    if (!recipientId || !cipherText || !iv || !encryptedKey) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Create deterministic DM chatId
    const makeDmId = (a, b) => {
      const [x, y] = [a, b].map(String).sort();
      return `dm-${x}-${y}`;
    };

    const chatId = makeDmId(senderId, recipientId);

    // Create chat if does not exist
    let chat = await Chat.findOne({ chatId });

    if (!chat) {
      chat = await Chat.create({
        chatId,
        members: [senderId, recipientId],
        isGroup: false
      });
    }

    // Save message
    const msg = new Message({
      messageId: randomUUID(),
      chatId,
      senderId,
      receiverId: recipientId,
      cipherText,
      iv,
      encryptedKey,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    console.log("Saving message:", msg);

    const saved = await msg.save();

    return res.status(201).json({
      success: true,
      data: saved,
      chatId
    });

  } catch (err) {
    console.error("messageSend error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default messageSend;
