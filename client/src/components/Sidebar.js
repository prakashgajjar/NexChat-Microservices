"use client";
import { FiUsers, FiMessageCircle, FiSettings, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={`flex flex-col items-center w-20 py-6 space-y-8 border-r shadow-sm transition-colors duration-300 ${
        theme === "dark" ? "bg-zinc-900 text-gray-100 border-gray-700" : "bg-white text-gray-800 border-gray-200"
      }`}
    >
      <FiUsers className="text-2xl hover:text-blue-600 cursor-pointer" />
      <FiMessageCircle className="text-2xl hover:text-blue-600 cursor-pointer" />
      <div className="mt-auto mb-6 space-y-4 flex flex-col items-center">
        {theme === "light" ? (
          <FiMoon className="text-2xl hover:text-blue-600 cursor-pointer" onClick={toggleTheme} />
        ) : (
          <FiSun className="text-2xl hover:text-yellow-400 cursor-pointer" onClick={toggleTheme} />
        )}
        <FiSettings className="text-2xl hover:text-blue-600 cursor-pointer" />
      </div>
    </aside>
  );
}
