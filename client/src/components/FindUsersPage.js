"use client";

import { useState, useEffect } from "react";
import { Search, MessageCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { getUserProfileByUsername } from "@/services/user/user.service.js";
import { useRouter } from "next/navigation";

export default function FindUsersPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await getUserProfileByUsername(search);
        setResults(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div
      className={`h-screen flex transition-colors duration-300
        ${isDark ? "bg-zinc-900 text-white" : "bg-gray-100 text-gray-900"}
      `}
    >
      {/* LEFT PANEL */}
      <div
        className={`w-full flex flex-col px-4 py-5 border-r
          ${isDark ? "border-zinc-800" : "border-gray-200"}
        `}
      >
        {/* Search */}
        <div className="relative mb-5">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5
              ${isDark ? "text-zinc-400" : "text-gray-500"}
            `}
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none border text-sm
              ${
                isDark
                  ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                  : "bg-white border-gray-300 placeholder-gray-500"
              }
            `}
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {loading && (
            <p className="text-center opacity-60 py-10">Searching...</p>
          )}

          {!loading && search && results.length === 0 && (
            <p className="text-center opacity-60 py-10">
              No users found
            </p>
          )}

          {results.map((u) => (
            <div
              key={u?._id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-colors
                ${
                  isDark
                    ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                    : "bg-white border-gray-300 hover:bg-gray-200"
                }
              `}
            >
              {/* User info */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${
                      isDark
                        ? "bg-zinc-700 text-gray-200"
                        : "bg-gray-200 text-gray-800"
                    }
                  `}
                >
                  {u?.username?.[0]?.toUpperCase()}
                </div>

                <div>
                  <p className="font-medium">{u?.username}</p>
                  <p className="text-sm opacity-60">
                    {u?.fullname}
                  </p>
                </div>
              </div>

              {/* Message button */}
              <button
                onClick={() => router.push(`/home?id=${u?.userId}`)}
                className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
