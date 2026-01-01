"use client";

import { io } from "socket.io-client";
import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext.context.js";
import { useSearchParams } from "next/navigation";
import { getUserProfile } from "@/services/user/user.service.js";
import {
  sendMessage,
  getMessages,
} from "@/services/message/message.service.js";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

// Format time like WhatsApp → "4:23 PM"
function formatMessageTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateLabel(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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

  useEffect(() => {
    async function loadUserFromURL() {
      if (!selectedUser && userIdFromURL) {
        try {
          const user = await getUserProfile(userIdFromURL);
          // console.log(user);
          setIsBgAvailable(user?.ui?.chatBgUrl);
          // setIsBgAvailable(
          //   "https://images.pexels.com/photos/28029006/pexels-photo-28029006.jpeg"
          // );
          setSelectedUser(user);
        } catch (err) {
          console.log("Could not load user from URL:", err);
        }
      }
    }

    loadUserFromURL();
  }, [userIdFromURL, selectedUser]);

  useEffect(() => {
    if (!currentUser?.userId) return;

    const URL = process.env.NEXT_PUBLIC_BACKEND_URL_REALTIME;

    socket = io(URL, {
      query: { userId: currentUser.userId },
      transports: ["websocket"],
    });

    socket.on("new-message", (data) => {
      const formatted = {
        id: Date.now(),
        text: atob(data.cipherText),
        senderId: data.senderId,
        receiverId: data.receiverId,
        createdAt: data.createdAt,
        fromMe: data.senderId === currentUser.userId,
      };

      setMessages((prev) => [...prev, formatted]);
      scrollToBottom();
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
      console.log(currentUser);
      try {
        setMessages([]);
        const msgs = await getMessages(userToLoad);

        if (!isMounted) return;

        const formatted = msgs.map((m) => ({
          id: m._id,
          text: m.cipherText ? atob(m.cipherText) : "",
          senderId: m.senderId,
          receiverId: m.receiverId,
          createdAt: m.createdAt,
          fromMe: m.senderId === currentUser.userId,
        }));

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
      cipherText: btoa(messageText),
      iv: btoa("iv"),
      encryptedKey: btoa("key"),
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

  const avatarLetter = () =>
    selectedUser?.username?.charAt(0)?.toUpperCase() || "?";

  if (!selectedUser && !userIdFromURL) {
    return (
        <div className="flex h-screen w-full">

      {/* Chat Empty State */}
      <div
        className={`flex-1 flex flex-col items-center justify-center text-center transition-colors duration-300
          ${
            theme === "dark"
              ? "bg-zinc-900 text-gray-300"
              : "bg-gray-100 text-gray-700"
          }
        `}
      >
        {/* Icon */}
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

        {/* Title */}
        <h2 className="text-3xl font-semibold">
          NexChat
        </h2>

        {/* Subtitle */}
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
  {/* HEADER */}
  <header
    className={`flex items-center gap-3 px-6 py-3 border-b ${
      theme === "dark"
        ? "bg-zinc-900 border-zinc-800 text-gray-100"
        : "bg-white border-gray-200 text-black"
    }`}
  >
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
        theme === "dark"
          ? "bg-zinc-800 text-gray-200"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {activeUser.username?.charAt(0)?.toUpperCase() || "?"}
    </div>
    <div className="flex flex-col">
      <p className="font-semibold">{activeUser?.username}</p>

      <span
        className={`text-xs ${
          isOnline ? "text-green-400" : "text-gray-400"
        }`}
      >
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  </header>

  {/* MESSAGES - Wrapper with relative positioning */}
  <div className="relative flex-1 overflow-hidden">
    {/* Fixed Background Image */}
    {isBgAvailable && (
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={`${isBgAvailable}`}
          alt="Chat background"
          fill
          priority
          className="object-cover "
        />
      </div>
    )}

    {/* Scrollable Content */}
    <div
      ref={scrollRef}
      className={`absolute inset-0 overflow-y-auto px-6 py-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-transparent" : "bg-transparent"
      }`}
    >
      <div className="relative z-[100px] space-y-3">
        {Object.entries(
          messages.reduce((acc, msg) => {
            const label = getDateLabel(msg.createdAt);
            if (!acc[label]) acc[label] = [];
            acc[label].push(msg);
            return acc;
          }, {})
        ).map(([label, msgs]) => (
          <div key={label}>
            <div className="text-center my-3">
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  theme === "dark"
                    ? "bg-zinc-800 text-gray-300"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {label}
              </span>
            </div>

            {msgs.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.fromMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 mb-1 rounded-xl max-w-xs text-sm shadow ${
                    msg.fromMe
                      ? theme === "dark"
                        ? "bg-zinc-700 text-white"
                        : "bg-zinc-300 text-black"
                      : theme === "dark"
                      ? "bg-zinc-800 border border-zinc-700 text-gray-100"
                      : "bg-white border border-gray-300"
                  }`}
                >
                  <div className="flex items-end gap-2">
                    <p className="whitespace-pre-wrap break-words flex-1 leading-relaxed">
                      {msg.text}
                    </p>
                    <span className="text-[10px] opacity-70 min-w-fit">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* INPUT BAR */}
  <footer
    className={`p-4 border-t flex items-center ${
      theme === "dark"
        ? "bg-zinc-900 border-zinc-800"
        : "bg-white border-gray-200"
    }`}
  >
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSend()}
      placeholder="Type a message"
      className={`flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 ${
        theme === "dark"
          ? "bg-zinc-800 text-gray-200 border-zinc-700 focus:ring-zinc-600"
          : "bg-white text-black border-gray-300 focus:ring-gray-400"
      }`}
    />

    <button
      onClick={handleSend}
      className={`ml-3 p-2 rounded-lg transition border ${
        theme === "dark"
          ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-gray-200"
          : "bg-gray-200 hover:bg-gray-300 border-gray-400 text-black"
      }`}
    >
      <FiSend size={18} />
    </button>
  </footer>
</div>
  );
}
