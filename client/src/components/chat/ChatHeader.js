"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ChatHeader({ activeUser, isOnline }) {
  const { theme } = useTheme();

  return (
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
        {activeUser?.username?.charAt(0)?.toUpperCase() || "?"}
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
  );
}