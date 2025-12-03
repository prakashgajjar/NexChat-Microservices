    import { randomUUID } from "crypto";
    import Message from "../models/Message.models.js";
    import Chat from "../models/Chat.models.js";

    const messageSend = async (req, res) => {
        try {
            const {
                chatId,
                senderId,
                cipherText,
                iv,
                encryptedKey,
                scheduledAt = null,
                expiresAt = null,
                messageId,
                members,
                recipientId 
            } = req.body || {};

            if (!senderId || !cipherText || !iv || !encryptedKey) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields"
                });
            }

            if (!chatId && !members && !recipientId) {
                return res.status(400).json({
                    success: false,
                    message: "Either chatId or recipientId must be provided to send a message"
                });
            }
            let chat = null;
            let usedChatId = chatId;

            const makeDmId = (a, b) => {
                const [x, y] = [a, b].map(String).sort();
                return `dm-${x}-${y}`;
            };

            if (chatId) {
                chat = await Chat.findOne({ chatId });
                if (!chat) {
                    // If chatId provided but not found then create it from members
                    let createMembers = members;
                    if (!createMembers && recipientId) createMembers = [senderId, recipientId];
                    if (!createMembers) {
                        return res.status(404).json({ success: false, message: "Chat not found and no members provided to create it" });
                    }

                    if (!createMembers.includes(senderId)) createMembers.push(senderId);

                    // For 1:1 chats
                    let newChatId = usedChatId;
                    if (!newChatId) {
                        if (createMembers.length === 2) {
                            newChatId = makeDmId(createMembers[0], createMembers[1]);
                        } else {
                            newChatId = randomUUID();
                        }
                    }

                    chat = await Chat.create({ chatId: newChatId, members: createMembers, isGroup: createMembers.length > 2 });
                    usedChatId = newChatId;
                }
            } else {
                // No chatId provided then create a new chat from members 
                let createMembers = members;
                if (!createMembers && recipientId) createMembers = [senderId, recipientId];
                if (!createMembers) {
                    return res.status(400).json({ success: false, message: "No members provided to create chat" });
                }

                createMembers = Array.from(new Set([...(createMembers || []), senderId]));
                if (createMembers.length === 2) {
                    usedChatId = makeDmId(createMembers[0], createMembers[1]);
                } else {
                    usedChatId = randomUUID();
                }
                chat = await Chat.create({ chatId: usedChatId, members: createMembers, isGroup: createMembers.length > 2 });
            }

            if (!chat.members || !chat.members.includes(senderId)) {
                return res.status(403).json({ success: false, message: "Sender is not a member of this chat" });
            }
            const msg = new Message({
                messageId: messageId || randomUUID(),
                chatId: chat.chatId || usedChatId,
                senderId,
                cipherText,
                iv,
                encryptedKey,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                expiresAt: expiresAt ? new Date(expiresAt) : null
            });

            const saved = await msg.save();

            return res.status(201).json({ success: true, data: saved });
        } catch (err) {
            console.error("messageSend error:", err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };

    export default messageSend;