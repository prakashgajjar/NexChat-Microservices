"use client";

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

function formatMessageTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateLabel(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ChatMessages({ messages, scrollRef, isBgAvailable }) {
  const { theme } = useTheme();

  const groupedMessages = messages.reduce((acc, msg) => {
    const label = getDateLabel(msg.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(msg);
    return acc;
  }, {});

  return (
    <div className="relative flex-1 overflow-hidden">

      {/* 🔹 BACKGROUND LAYER */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-300
          ${
            isBgAvailable
              ? ""
              : theme === "dark"
              ? "bg-zinc-900"
              : "bg-gray-50"
          }
        `}
      >
        {isBgAvailable && (
          <Image
            src={isBgAvailable}
            alt="Chat background"
            fill
            priority
            className="object-cover"
          />
        )}
      </div>

      {/* 🔹 SCROLLABLE CONTENT */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto px-6 py-4"
      >
        <div className="relative z-10 space-y-3">
          {Object.entries(groupedMessages).map(([label, msgs]) => (
            <div key={label}>
              <div className="text-center my-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    theme === "dark"
                      ? "bg-zinc-800 text-gray-300"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {label}
                </span>
              </div>

              {msgs.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.fromMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 mb-1 rounded-xl max-w-xs text-sm shadow ${
                      msg.fromMe
                        ? theme === "dark"
                          ? "bg-zinc-700 text-white"
                          : "bg-zinc-300 text-black"
                        : theme === "dark"
                        ? "bg-zinc-800 border border-zinc-700 text-gray-100"
                        : "bg-white border border-gray-300"
                    }`}
                  >
                    <div className="flex items-end gap-2">
                      <p className="whitespace-pre-wrap break-words flex-1 leading-relaxed">
                        {msg.text}
                      </p>
                      <span className="text-[10px] opacity-70 min-w-fit">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
