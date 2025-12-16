"use client";

import React, { useState } from "react";
import { HelpCircle, MessageSquareText, Send } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const HelpAndFeedbackPage = () => {
  const { theme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) return;
    // TODO: connect API / email / backend
    // console.log("Feedback submitted:", message);
    setMessage("");
  };

  return (
    <div
      className={`
        min-h-screen w-full transition-colors duration-300 flex justify-center pt-4
        ${isDark ? "bg-zinc-900 text-white" : "bg-gray-100 text-gray-900"}
      `}
    >
      <div className="sm:w-[900px] w-[400px]">
        <div
          className={`
          px-5 py-4 border-b
          ${isDark ? "border-zinc-800" : "border-gray-200"}
        `}
        >
          <h1 className="text-lg font-semibold">Help & Feedback</h1>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            We’re here to help and improve your experience
          </p>
        </div>

        {/* Content */}
        <div className="px-5 py-6  space-y-8">
          {/* Help Info */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 opacity-80" />
              <h2 className="font-medium">Need help?</h2>
            </div>

            <div
              className={`
              rounded-xl border p-4 space-y-2
              ${
                isDark
                  ? "bg-zinc-800 border-zinc-800"
                  : "bg-white border-gray-200"
              }
            `}
            >
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                • Issues with chat background or theme
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                • App not loading or crashing
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                • Feature request or improvement idea
              </p>
            </div>
          </section>

          {/* Feedback Form */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquareText className="w-5 h-5 opacity-80" />
              <h2 className="font-medium">Send feedback</h2>
            </div>

            <div
              className={`
              rounded-xl border p-3
              ${
                isDark
                  ? "bg-zinc-800 border-zinc-800"
                  : "bg-white border-gray-200"
              }
            `}
            >
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className={`
                w-full resize-none bg-transparent outline-none text-sm
                ${
                  isDark
                    ? "text-white placeholder-gray-500"
                    : "text-gray-900 placeholder-gray-400"
                }
              `}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!message.trim()}
              className={`
              mt-3 w-full flex items-center justify-center gap-2
              px-4 py-2 rounded-xl font-medium transition
              ${
                message.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-400 text-white opacity-50 cursor-not-allowed"
              }
            `}
            >
              <Send size={18} />
              Send
            </button>
          </section>

          {/* Footer Note */}
          <p
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Your feedback is valuable and helps us improve the app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpAndFeedbackPage;
