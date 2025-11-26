"use client";
import { FiSend } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function ChatWindow({ selectedChat, messages }) {
  const { theme } = useTheme();

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header
        className={`flex items-center justify-between px-6 py-3 border-b transition-colors duration-300 ${
          theme === "dark" ? "bg-zinc-900 border-gray-700 text-white" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
            {selectedChat.charAt(0)}
          </div>
          <p className="font-semibold">{selectedChat}</p>
        </div>
      </header>

      {/* Chat Area */}
      <div
        className={`flex-1 overflow-y-auto px-6 py-4 space-y-3 transition-colors ${
          theme === "dark" ? "bg-zinc-900" : "bg-gray-50"
        }`}
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow-sm ${
                msg.fromMe
                  ? "bg-blue-600 text-white"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-100 border border-gray-700"
                  : "bg-white border"
              }`}
            >
              <p>{msg.text}</p>
              <span className="block text-[10px] text-gray-300 mt-1 text-right">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer
        className={`p-4 border-t flex items-center transition-colors duration-300 ${
          theme === "dark" ? "bg-zinc-900 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <input
          type="text"
          placeholder="Type a message"
          className={`flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            theme === "dark" ? "bg-zinc-850 text-gray-200 border-gray-700" : ""
          }`}
        />
        <button className="ml-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
          <FiSend />
        </button>
      </footer>
    </div>
  );
}
