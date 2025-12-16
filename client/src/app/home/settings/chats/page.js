"use client";

import React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import ThemeSwiper from "./ThemeSwiper";

const themeOptions = [
  {
    id: "light",
    label: "Light",
    desc: "Bright background with dark text",
    icon: Sun,
  },
  {
    id: "dark",
    label: "Dark",
    desc: "Dark background, easier on eyes",
    icon: Moon,
  },
];

const ChatAppearancePage = () => {
  const { theme } = useTheme();

  /* Resolve system theme */
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div
      className={`
        min-h-screen w-full transition-colors duration-300 flex justify-center
        ${isDark ? "bg-zinc-900 text-white" : "bg-gray-100 text-gray-900"}
      `}
    >
      <div className="sm:w-[900px] w-[400px]">
        {/* Header */}
        <div
          className={`
          px-5 py-4 border-b
          ${isDark ? "border-zinc-800" : "border-gray-200"}
        `}
        >
          <h1 className="text-lg font-semibold">Chat Appearance</h1>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Customize how chats look and feel
          </p>
        </div>

        {/* Content */}
        <div className="px-5 py-6 space-y-8 ">
          {/* Theme Section */}
          <section>
            <h2 className="font-medium mb-3">Theme</h2>

            <div className="space-y-2">
              {themeOptions.map((option) => {
                const isActive = theme === option.id;

                return (
                  <button
                    key={option.id}
                    className={`
                    w-full flex items-center justify-between
                    px-4 py-3 rounded-xl border transition
                    ${
                      isActive
                        ? isDark
                          ? "bg-zinc-800 border-zinc-700"
                          : "bg-white border-gray-300"
                        : isDark
                        ? "hover:bg-zinc-800 border-zinc-800"
                        : "hover:bg-gray-100 border-gray-200"
                    }
                  `}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <option.icon className="w-5 h-5 opacity-80" />
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {option.desc}
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <span className="text-sm font-medium text-blue-500">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Background Section */}
          <section>
            <ThemeSwiper isDark={isDark} />
          </section>

          {/* Info */}
          <section>
            <h2 className="font-medium mb-2">About appearance</h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              The selected theme applies to all chats and screens. Backgrounds
              and chat colors automatically adjust for comfort and readability.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChatAppearancePage;
