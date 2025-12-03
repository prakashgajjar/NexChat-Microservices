"use client";
import {
  FiUsers,
  FiMessageCircle,
  FiSettings,
  FiMoon,
  FiSun,
  FiMapPin,     // Nearby Chats
  FiSearch      // Find User
} from "react-icons/fi";

import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside
      className={`
        flex flex-col items-center w-20 py-6 space-y-8 border-r shadow-sm transition-all duration-300
        ${isDark ? "bg-zinc-900 text-gray-100 border-zinc-800" : "bg-white text-gray-800 border-gray-200"}
      `}
    >

      {/* USERS */}
      <FiUsers
        className="text-2xl cursor-pointer hover:text-gray-400 transition"
      />

      {/* NEARBY CHATS */}
      <FiMapPin
        className="text-2xl cursor-pointer hover:text-gray-400 transition"
      />

      {/* FIND USER */}
      <FiSearch
        className="text-2xl cursor-pointer hover:text-gray-400 transition"
      />

      {/* ALL CHATS */}
      <FiMessageCircle
        className="text-2xl cursor-pointer hover:text-gray-400 transition"
      />

      {/* Bottom Section */}
      <div className="mt-auto mb-6 space-y-4 flex flex-col items-center">

        {/* THEME TOGGLE */}
        {isDark ? (
          <FiSun
            className="text-2xl cursor-pointer hover:text-gray-400 transition"
            onClick={toggleTheme}
          />
        ) : (
          <FiMoon
            className="text-2xl cursor-pointer hover:text-gray-500 transition"
            onClick={toggleTheme}
          />
        )}

        {/* SETTINGS */}
        <FiSettings
          className="text-2xl cursor-pointer hover:text-gray-400 transition"
        />
      </div>
    </aside>
  );
}
