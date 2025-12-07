import { randomUUID } from "crypto";
import Message from "../models/Message.models.js";
import Chat from "../models/Chat.models.js";
import axios from "axios"; // If calling user-service

const messageSend = async (req, res) => {
  const axiosConfig = {
    timeout: 7000,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.cookies?.accessToken || "",
    },
    validateStatus: () => true,
  };

  try {
    const senderId = req.user.userId;

    const {
      recipientId,
      cipherText,
      iv,
      encryptedKey,
      expiresAt = null,
      scheduledAt = null,
    } = req.body;

    if (!recipientId || !cipherText || !iv || !encryptedKey) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const makeDmId = (a, b) => {
      const [x, y] = [a, b].map(String).sort();
      return `dm-${x}-${y}`;
    };

    const chatId = makeDmId(senderId, recipientId);

    // Check if chat exists
    let chat = await Chat.findOne({ chatId });

    const isFirstMessage = !chat;

    // Create chat if first message ever
    if (!chat) {
      chat = await Chat.create({
        chatId,
        members: [senderId, recipientId],
        isGroup: false,
      });
    }

    // Save message
    const saved = await Message.create({
      messageId: randomUUID(),
      chatId,
      senderId,
      receiverId: recipientId,
      cipherText,
      iv,
      encryptedKey,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    // Add contacts on FIRST message only
    if (isFirstMessage) {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL_USER}/api/services/contacts/add`;

        const response = await axios.post(
          url,
          {
            userId: senderId,
            contactId: recipientId,
          },
          axiosConfig
        );

        if (!response || response.status !== 200) {
          console.error(
            "Contact add service returned an unexpected status:",
            response?.status,
            response?.data
          );
        }
      } catch (error) {
        // Handle all axios-level failures
        if (error.response) {
          console.error("User-service error:", {
            status: error.response.status,
            data: error.response.data,
          });
        } else if (error.request) {
          console.error("User-service did not respond:", error.message);
        } else {
          console.error("Failed to call user-service:", error.message);
        }
      }
    }

    return res.status(201).json({
      success: true,
      data: saved,
      chatId,
    });
  } catch (err) {
    console.error("messageSend error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default messageSend;
