"use client";

import { FiSend } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

export default function ChatInput({ input, setInput, handleSend }) {
  const { theme } = useTheme();

  return (
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
  );
}