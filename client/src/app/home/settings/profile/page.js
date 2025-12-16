"use client";

import React from "react";
import { ArrowLeft, Pencil, Phone, Copy } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext.context.js";

const ProfilePage = () => {
  const { theme } = useTheme();
  const { currentUser } = useAppContext();
  const router = useRouter();

  const isDark = theme === "dark";

  return (
    <div
      className={`h-screen w-full transition-colors duration-300 sm:px-12 flex justify-center
        ${isDark ? "bg-zinc-900 text-white" : "bg-gray-100 text-gray-900"}
      `}
    >
      <div className="sm:w-[900px] w-[400px]">
        {/* Header */}
      <div
        className={`flex items-center gap-4 px-4 py-4 border-b
          ${isDark ? "border-zinc-800" : "border-gray-200"}
        `}
      >
        <button
          onClick={() => router.back()}
          className="hover:opacity-80 md:hidden
"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-lg font-semibold">Profile</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-6 py-6">
        {/* Avatar */}
        <div className="relative mb-6">
          <div
            className={`w-36 h-36 rounded-full flex items-center justify-center text-4xl font-semibold
              ${isDark ? "bg-zinc-800" : "bg-gray-200"}
            `}
          >
            {(currentUser?.fullname || currentUser?.username)
              ?.charAt(0)
              ?.toUpperCase()}
          </div>
        </div>

        {/* Name */}
        <div className="w-full mb-6">
          <p className="text-sm opacity-60 mb-1">Name</p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">
              {currentUser?.fullname || currentUser?.username}
            </p>
            <Pencil className="w-4 h-4 opacity-70 cursor-pointer" />
          </div>
        </div>

        {/* About */}
        <div className="w-full mb-6">
          <p className="text-sm opacity-60 mb-1">About</p>
          <p className="text-base opacity-90">
            {currentUser?.about || "Hey there! I am using NexChat."}
          </p>
        </div>

        {/* Phone */}
        <div className="w-full">
          <p className="text-sm opacity-60 mb-1">Phone</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 opacity-70" />
              <p className="text-base">
                {currentUser?.phone || "+91 XXXXX XXXXX"}
              </p>
            </div>
            <Copy
              className="w-4 h-4 opacity-70 cursor-pointer"
              onClick={() =>
                navigator.clipboard.writeText(currentUser?.phone || "")
              }
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
