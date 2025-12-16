"use client";

import { useTheme } from "../context/ThemeContext";

export default function ChatList() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`flex flex-col border-r transition-all duration-300  h-screen
        ${
          isDark
            ? "bg-zinc-900 border-zinc-800 text-gray-100"
            : "bg-white border-gray-200 text-zinc-800"
        }
      `}
    ></div>
  );
}
