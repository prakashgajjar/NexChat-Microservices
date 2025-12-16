"use client";

import React from "react";
import { Search, MessageSquare, HelpCircle, LogOut } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext.context.js";
import { useRouter, usePathname } from "next/navigation";

const settingsItems = [
  {
    id: "chats",
    label: "Chats",
    desc: "Theme, wallpaper, chat settings",
    icon: MessageSquare,
    href: "/home/settings/chats",
  },
  {
    id: "help",
    label: "Help and feedback",
    desc: "Help centre, contact us, privacy policy",
    icon: HelpCircle,
    href: "/home/settings/helps",
  },
];

export default function SettingsSidebar() {
  const { theme } = useTheme();
  const { currentUser, setCurrentUser } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  const isDark = theme === "dark";

  return (
    <aside
      className={`h-screen w-full px-4 py-5 border-r transition-colors
        ${
          isDark
            ? "bg-zinc-900 text-zinc-100 border-zinc-800"
            : "bg-white text-zinc-900 border-zinc-200"
        }`}
    >
      {/* Header */}
      <h1 className="text-xl font-semibold mb-4">Settings</h1>

      {/* Search */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-6 border
          ${
            isDark
              ? "bg-zinc-800 border-zinc-700"
              : "bg-gray-50 border-gray-200"
          }`}
      >
        <Search size={18} className="opacity-70" />
        <input
          type="text"
          placeholder="Search settings"
          className={`w-full bg-transparent outline-none text-sm
            ${isDark ? "placeholder-zinc-400" : "placeholder-gray-500"}`}
        />
      </div>

      {/* Profile */}
      {/* Profile */}
      <button
        onClick={() => router.push("/home/settings/profile")}
        className={`w-full flex items-center gap-3 mb-6 px-2 py-2 rounded-lg text-left transition-colors
    ${
      isDark
        ? "hover:bg-zinc-800 active:bg-zinc-700"
        : "hover:bg-gray-100 active:bg-gray-200"
    }
  `}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold
      ${isDark ? "bg-zinc-800" : "bg-gray-200"}
    `}
        >
          {(currentUser?.fullname || currentUser?.username)
            ?.charAt(0)
            ?.toUpperCase()}
        </div>

        <div>
          <p className="font-medium">
            {currentUser?.fullname || currentUser?.username}
          </p>
          <p className="text-sm opacity-70">Hey there! I am using NexChat.</p>
        </div>
      </button>

      <div
        className={`${
          isDark ? "bg-zinc-400/40" : "bg-gray-500/40"
        }  w-full h-[1px] mb-2`}
      ></div>

      {/* Settings list */}
      <nav className="space-y-1">
        {settingsItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-start gap-4 px-3 py-3 rounded-lg text-left transition-colors
                ${
                  isActive
                    ? isDark
                      ? "bg-zinc-800"
                      : "bg-gray-100"
                    : isDark
                    ? "hover:bg-zinc-800"
                    : "hover:bg-gray-100"
                }`}
            >
              <item.icon size={20} className="mt-1 opacity-80" />
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm opacity-70">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => {
          setCurrentUser(null);
          router.push("/login");
        }}
        className="mt-6 flex items-center gap-3 text-red-500 px-3 py-2 rounded-lg hover:bg-red-500/10"
      >
        <LogOut size={20} />
        <span className="font-medium">Log out</span>
      </button>
    </aside>
  );
}
