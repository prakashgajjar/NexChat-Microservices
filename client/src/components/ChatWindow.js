"use client";

import { useState, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext.context.js";

export default function ChatWindow() {
  const { theme } = useTheme();
  const { selectedUser } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const avatarLetter = () => {
    if (!selectedUser) return "?";
    return selectedUser.username?.charAt(0)?.toUpperCase() || "?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: input,
      fromMe: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  // ---------------------------------------------------------
  // ✅ WhatsApp-style empty screen (when no user selected)
  // ---------------------------------------------------------
  if (!selectedUser) {
    return (
      <div
        className={`flex-1 flex flex-col items-center justify-center ${
          theme === "dark" ? "bg-zinc-900 text-gray-300" : "bg-gray-100 text-gray-600"
        }`}
      >
        <div className="text-5xl mb-4">💬</div>

        <h2 className="text-3xl font-semibold mb-2">NexChat</h2>

        <p className="text-sm opacity-80">
          End-to-end encrypted messaging. Select a user to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <header
        className={`flex items-center justify-between px-6 py-3 border-b ${
          theme === "dark"
            ? "bg-zinc-900 border-zinc-800 text-gray-100"
            : "bg-white border-gray-200 text-black"
        }`}
      >
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
            ${
              theme === "dark"
                ? "bg-zinc-800 text-gray-200"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {avatarLetter()}
          </div>

          <p className="font-semibold">{selectedUser.username}</p>
        </div>
      </header>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto px-6 py-4 space-y-3 ${
          theme === "dark" ? "bg-zinc-900" : "bg-gray-50"
        }`}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow-sm 
              ${
                msg.fromMe
                  ? theme === "dark"
                    ? "bg-zinc-700 text-white"
                    : "bg-zinc-300 text-black"
                  : theme === "dark"
                  ? "bg-zinc-800 text-gray-100 border border-zinc-700"
                  : "bg-white border border-gray-300"
              }`}
            >
              <p>{msg.text}</p>
              <span className={`block text-[10px] mt-1 text-right ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer
        className={`p-4 border-t flex items-center ${
          theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
        }`}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          type="text"
          placeholder="Type a message"
          className={`flex-1 p-2 rounded-lg border text-sm focus:outline-none focus:ring-2 
            ${
              theme === "dark"
                ? "bg-zinc-800 text-gray-200 border-zinc-700 focus:ring-zinc-600"
                : "bg-white text-black border-gray-300 focus:ring-gray-400"
            }
          `}
        />

        <button
          onClick={handleSend}
          className={`ml-3 p-2 rounded-lg transition border 
            ${
              theme === "dark"
                ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-gray-200"
                : "bg-gray-200 hover:bg-gray-300 border-gray-400 text-black"
            }
          `}
        >
          <FiSend size={18} />
        </button>
      </footer>
    </div>
  );
}
