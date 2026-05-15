"use client";

import { io } from "socket.io-client";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext.context.js";
import { useSearchParams } from "next/navigation";
import { getUserProfile } from "@/services/user/user.service.js";
import {
  sendMessage,
  getMessages,
} from "@/services/message/message.service.js";
import { MessageCircle } from "lucide-react";
import ChatHeader from "./chat/ChatHeader";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";

import { encryptMessage } from "@/utils/encryptionMessage.js";
import { decryptMessage } from "@/utils/decryptMessage.js";
import { importRSAPublicKey } from "@/utils/crypto.js";
import { TEST_PRIVATE_KEY_PEM } from "@/lib/testPrivateKey.js";

let socket;

export default function ChatWindow() {
  const { theme } = useTheme();
  const {
    selectedUser,
    setSelectedUser,
    currentUser,
    isBgAvailable,
    setIsBgAvailable,
  } = useAppContext();
  const searchParams = useSearchParams();
  const userIdFromURL = searchParams.get("id");

  const [isOnline, setIsOnline] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  async function loadUserFromURL() {
    console.log("loadUserFromURL called");

    if (!userIdFromURL) {
      console.log("No userIdFromURL");
      return;
    }

    try {
      console.log("Fetching user:", userIdFromURL);
      const user = await getUserProfile(userIdFromURL);
      console.log("Fetched user:", user);

      setSelectedUser(user);
      setIsBgAvailable(user?.ui?.chatBgUrl || null);
    } catch (err) {
      console.error("Could not load user from URL:", err);
    }
  }

  useEffect(() => {
    console.log("hello from chat window use effect");

    loadUserFromURL();
  }, [userIdFromURL]);

  useEffect(() => {
    if (!currentUser?.userId) return;

    const URL = process.env.NEXT_PUBLIC_BACKEND_URL_REALTIME;

    socket = io(URL, {
      query: { userId: currentUser.userId },
      transports: ["websocket"],
    });

    socket.on("new-message", async (data) => {
      try {
        if (data.receiverId !== currentUser.userId) return;

        const text = await decryptMessage({
          cipherText: data.cipherText,
          iv: data.iv,
          encryptedKey: data.encryptedKey,
          privateKeyPem: TEST_PRIVATE_KEY_PEM,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text,
            senderId: data.senderId,
            receiverId: data.receiverId,
            createdAt: data.createdAt,
            fromMe: false,
          },
        ]);
      } catch (e) {
        console.error("Decrypt failed:", e);
      }
    });

    socket.on("user-online", (onlineUserId) => {
      if (selectedUser?.userId === onlineUserId) setIsOnline(true);
    });

    socket.on("user-offline", (offlineUserId) => {
      if (selectedUser?.userId === offlineUserId) setIsOnline(false);
    });

    socket.on("online-users", (list) => {
      if (selectedUser?.userId && list.includes(selectedUser.userId))
        setIsOnline(true);
      else setIsOnline(false);
    });

    return () => socket.disconnect();
  }, [currentUser?.userId, selectedUser?.userId]);

  useEffect(() => {
    const userToLoad = selectedUser?.userId || userIdFromURL;
    if (!userToLoad || !currentUser?.userId) return;

    let isMounted = true;

    async function loadMessagesNow() {
      try {
        setMessages([]);
        const msgs = await getMessages(userToLoad);

        if (!isMounted) return;

        const formatted = await Promise.all(
          msgs.map(async (m) => {
            const text = await decryptMessage({
              cipherText: m.cipherText,
              iv: m.iv,
              encryptedKey: m.encryptedKey,
              privateKeyPem: TEST_PRIVATE_KEY_PEM,
            });

            return {
              id: m._id,
              text,
              senderId: m.senderId,
              receiverId: m.receiverId,
              createdAt: m.createdAt,
              fromMe: m.receiverId !== currentUser.userId,
            };
          })
        );

        setMessages(formatted);
        scrollToBottom();
      } catch (err) {
        console.error("Load messages error:", err);
      }
    }

    loadMessagesNow();
    return () => {
      isMounted = false;
    };
  }, [selectedUser?.userId, userIdFromURL, currentUser?.userId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userToSend = selectedUser?.userId || userIdFromURL;

    if (!userToSend) return;

    const messageText = input;
    setInput("");

    const tempId = Date.now();

    const { cipherText, iv, encryptedKey } = await encryptMessage(
      messageText
    );

    console.log(cipherText, iv, encryptedKey);

    const tempMessage = {
      id: tempId,
      text: messageText,
      createdAt: new Date().toISOString(),
      fromMe: true,
      senderId: currentUser.userId,
    };

    setMessages((prev) => [...prev, tempMessage]);
    scrollToBottom();

    const payload = {
      senderId: currentUser.userId,
      receiverId: userToSend,
      cipherText,
      iv,
      encryptedKey,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send-message", payload);

    try {
      const saved = await sendMessage({
        recipientId: userToSend,
        cipherText: payload.cipherText,
        iv: payload.iv,
        encryptedKey: payload.encryptedKey,
      });

      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...msg, id: saved._id } : msg))
      );
    } catch (err) {
      console.error("Failed saving message:", err);
    }
  };

  if (!selectedUser && !userIdFromURL) {
    return (
      <div className="flex h-screen w-full">
        <div
          className={`flex-1 flex flex-col items-center justify-center text-center transition-colors duration-300
          ${
            theme === "dark"
              ? "bg-zinc-900 text-gray-300"
              : "bg-gray-100 text-gray-700"
          }
        `}
        >
          <div
            className={`h-14 w-14 mb-4 rounded-2xl flex items-center justify-center shadow-sm
            ${
              theme === "dark"
                ? "bg-zinc-800 border border-zinc-700"
                : "bg-white border border-gray-200"
            }
          `}
          >
            <MessageCircle
              className={`h-7 w-7 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            />
          </div>

          <h2 className="text-3xl font-semibold">NexChat</h2>

          <p className="opacity-70 mt-2 text-sm max-w-xs">
            Select a user to start a conversation.
          </p>
        </div>
      </div>
    );
  }

  const activeUser = selectedUser || {};

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader activeUser={activeUser} isOnline={isOnline} />
      <ChatMessages
        messages={messages}
        scrollRef={scrollRef}
        isBgAvailable={isBgAvailable}
      />
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
    </div>
  );
}
