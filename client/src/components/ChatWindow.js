"use client";
import { useState, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

export default function ChatWindow({ selectedChat }) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Avatar letter (grayscale)
  const avatarLetter = () => {
    if (!selectedChat) return "?";
    const name = selectedChat.name || selectedChat.chatId || "U";
    return name.charAt(0).toUpperCase();
  };

  // Dummy send handler
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
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  };

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
          {/* Avatar (grayscale) */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
            ${theme === "dark" ? "bg-zinc-800 text-gray-200" : "bg-gray-200 text-gray-700"}`}
          >
            {avatarLetter()}
          </div>

          {/* Name */}
          <p className="font-semibold">
            {selectedChat?.name || selectedChat?.chatId || "Select chat"}
          </p>
        </div>
      </header>

      {/* Chat area */}
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
              <span
                className={`block text-[10px] mt-1 text-right ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
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

        {/* SEND BUTTON (grayscale) */}
        <button
          onClick={handleSend}
          className={`
            ml-3 p-2 rounded-lg transition border 
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
