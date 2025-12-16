"use client";

import React from "react";
import { Settings } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Page = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`flex h-screen w-full transition-colors duration-300
        ${isDark ? "bg-zinc-900 text-white" : "bg-gray-100 text-gray-800"}
      `}
    >
      {/* Main Settings Area */}
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center text-center gap-4">
          
          {/* Icon */}
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-md border
              ${
                isDark
                  ? "bg-zinc-800 border-zinc-700"
                  : "bg-white border-gray-200"
              }
            `}
          >
            <Settings
              className={`h-7 w-7 ${
                isDark ? "text-zinc-300" : "text-gray-600"
              }`}
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold tracking-wide">
            Settings
          </h1>

          {/* Subtitle */}
          <p
            className={`text-sm max-w-xs ${
              isDark ? "text-zinc-400" : "text-gray-500"
            }`}
          >
            Select a category from the sidebar to view and update your preferences.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Page;
