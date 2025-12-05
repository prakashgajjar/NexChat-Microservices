"use client";

import { io } from "socket.io-client";
import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext.context.js";
import {
  sendMessage,
  getMessages,
} from "@/services/message/message.service.js";

// Format time like WhatsApp → "4:23 PM"
function formatMessageTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

let socket;
// Format date section → "Today", "Yesterday", "05 Dec 2025"
function getDateLabel(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ChatWindow() {
  const { theme } = useTheme();
  const { selectedUser, currentUser } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  //real time socket connection

  useEffect(() => {
    if (!currentUser?.userId) return;

    const URL = process.env.NEXT_PUBLIC_BACKEND_URL_REALTIME;

socket = io(URL, {
  query: { userId: currentUser.userId },
  transports: ["websocket"],
});


    // When receiver sends real-time message
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

    return () => socket.disconnect();
  }, [currentUser?.userId]);

  // Load messages whenever selected user changes
  useEffect(() => {
    if (!selectedUser?.userId || !currentUser?.userId) return;

    let isMounted = true;

    async function loadMessages() {
      try {
        setMessages([]); // Clear old chat instantly
        const msgs = await getMessages(selectedUser.userId);

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
      } catch (err) {
        console.error("Load messages error:", err);
      }
    }

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [selectedUser?.userId, currentUser?.userId]);

  // Send Message
  const handleSend = async () => {
  if (!input.trim()) return;

  const messageText = input;
  setInput("");

  const tempId = Date.now();

  // Temporary UI message
  const tempMessage = {
    id: tempId,
    text: messageText,
    createdAt: new Date().toISOString(),
    fromMe: true,
    senderId: currentUser.userId,
  };

  setMessages(prev => [...prev, tempMessage]);
  scrollToBottom();

  // Prepare encrypted payload
  const payload = {
    senderId: currentUser.userId,
    receiverId: selectedUser.userId,
    cipherText: btoa(messageText),
    iv: btoa("iv"),
    encryptedKey: btoa("key"),
    createdAt: new Date().toISOString(),
  };

  // REALTIME — send instantly to receiver
  socket.emit("send-message", payload);

  // DB STORAGE — save message history
  try {
    const saved = await sendMessage({
      recipientId: selectedUser.userId,
      cipherText: payload.cipherText,
      iv: payload.iv,
      encryptedKey: payload.encryptedKey,
    });

    // Update temporary message ID to real DB ID
    setMessages(prev =>
      prev.map(msg => (msg.id === tempId ? { ...msg, id: saved._id } : msg))
    );
  } catch (err) {
    console.error("Failed saving message:", err);
  }
};


  // Avatar
  const avatarLetter = () =>
    selectedUser?.username?.charAt(0)?.toUpperCase() || "?";

  // Default screen when no user selected
  if (!selectedUser) {
    return (
      <div
        className={`flex-1 flex flex-col items-center justify-center text-center ${
          theme === "dark"
            ? "bg-zinc-900 text-gray-300"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        <div className="text-5xl mb-4">💬</div>
        <h2 className="text-3xl font-semibold">NexChat</h2>
        <p className="opacity-70 mt-2 text-sm">
          End-to-end encrypted. Select a user to start a conversation.
        </p>
      </div>
    );
  }

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
          {avatarLetter()}
        </div>
        <p className="font-semibold">{selectedUser.username}</p>
      </header>

      {/* CHAT MESSAGES */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto px-6 py-4 space-y-3 ${
          theme === "dark" ? "bg-zinc-900" : "bg-gray-50"
        }`}
      >
        {/** WhatsApp Style Date Separator */}
        {(() => {
          // Group messages by date label
          const grouped = messages.reduce((acc, msg) => {
            const dateLabel = getDateLabel(msg.createdAt);
            if (!acc[dateLabel]) acc[dateLabel] = [];
            acc[dateLabel].push(msg);
            return acc;
          }, {});

          return Object.entries(grouped).map(([dateLabel, msgs]) => (
            <div key={dateLabel}>
              <div className="text-center my-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    theme === "dark"
                      ? "bg-zinc-800 text-gray-300"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {dateLabel}
                </span>
              </div>
              {msgs.map((msg) => {
                const isMine = msg.fromMe;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 mb-1 rounded-xl max-w-xs text-sm shadow 
      ${
        isMine
          ? theme === "dark"
            ? "bg-zinc-700 text-white"
            : "bg-zinc-300 text-black"
          : theme === "dark"
          ? "bg-zinc-800 border border-zinc-700 text-gray-100"
          : "bg-white border border-gray-300"
      }
    `}
                    >
                      <div className="flex items-end gap-2">
                        <p className="whitespace-pre-wrap wrap-break-word flex-1 leading-relaxed">
                          {msg.text}
                        </p>

                        <span className="text-[10px] opacity-70 min-w-fit">
                          {formatMessageTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ));
        })()}
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
