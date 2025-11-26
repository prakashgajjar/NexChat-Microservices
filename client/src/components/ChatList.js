"use client";
import { useTheme } from "../context/ThemeContext";

export default function ChatList({ chats, selectedChat, setSelectedChat }) {
  const { theme } = useTheme();

  return (
    <div
      className={`w-80 flex flex-col transition-colors duration-300 ${
        theme === "dark" ? "bg-zinc-900 text-gray-100 border-zinc-950" : "bg-white text-zinc-800 border-gray-200"
      } border-r`}
    >
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600">NexChat</h1>
        <p className="text-xs text-gray-500">End-to-end encrypted distributed chat</p>
        <input
          type="text"
          placeholder="Search"
          className={`mt-3 w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            theme === "dark" ? "bg-zinc-900 text-gray-200 border-zinc-900" : ""
          }`}
        />
      </div>

      <div className="overflow-y-auto flex-1">
        {chats.map((chat, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedChat(chat.name)}
            className={`flex items-center px-4 py-3 cursor-pointer transition ${
              selectedChat === chat.name
                ? "bg-blue-50 dark:bg-zinc-600/30 "
                : `${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-300"} hover:bg-gray-100 `
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 font-bold text-blue-700">
              {chat.name.charAt(0)}
            </div>
            <div className="ml-3 flex-1">
              <p className="font-medium">{chat.name}</p>
              <p className="text-sm text-gray-500 truncate">{chat.message}</p>
            </div>
            <span className="text-xs text-gray-400">{chat.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
