"use client";
import { useTheme } from "../context/ThemeContext";

export default function ChatList({ chats, selectedChat, setSelectedChat }) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      className={`w-80 flex flex-col border-r transition-all duration-300 
        ${
          isDark
            ? "bg-zinc-900 border-zinc-800 text-gray-100"
            : "bg-white border-gray-200 text-zinc-800"
        }
      `}
    >
      {/* Header */}
      <div
        className={`p-4 border-b ${
          isDark
            ? "border-zinc-800 bg-zinc-900/60 backdrop-blur-sm"
            : "border-gray-200 bg-white/50 backdrop-blur-sm"
        }`}
      >
        <h1
          className={`
    text-3xl font-bold mb-2 bg-linear-to-r 
    ${isDark ? "from-gray-300 to-gray-500" : "from-zinc-700 to-zinc-500"}
    text-transparent bg-clip-text
  `}
        >
          NexChat
        </h1>

        <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs`}>
          End-to-end encrypted distributed chat
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search"
          className={`mt-3 w-full p-2 rounded-lg text-sm outline-none transition 
            ${
              isDark
                ? "bg-zinc-800 text-gray-200 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-100 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-400"
            }
          `}
        />
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto flex-1">
        {chats.length === 0 && (
          <div className="text-center text-gray-500 py-6 text-sm">
            No chats yet
          </div>
        )}

        {chats.map((chat) => {
          const id = chat.chatId || chat.id || chat.name;
          const isActive = selectedChat === id;

          return (
            <div
              key={id}
              onClick={() => setSelectedChat(id)}
              className={`
                flex items-center px-4 py-3 cursor-pointer transition-all 
                ${
                  isActive
                    ? isDark
                      ? "bg-zinc-700/40 border-l-4 border-blue-500"
                      : "bg-blue-50 border-l-4 border-blue-500"
                    : isDark
                    ? "hover:bg-zinc-800"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {/* Avatar */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold 
                  ${
                    isDark
                      ? "bg-blue-900 text-blue-200"
                      : "bg-blue-100 text-blue-700"
                  }
                `}
              >
                {chat.name?.charAt(0)?.toUpperCase()}
              </div>

              {/* Chat info */}
              <div className="ml-3 flex-1">
                <p className="font-medium truncate">{chat.name}</p>
                <p
                  className={`text-sm truncate ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {chat.message || "No messages yet"}
                </p>
              </div>

              {/* Time */}
              <span
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {chat.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
