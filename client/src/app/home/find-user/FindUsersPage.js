"use client";

import { useState, useEffect } from "react";
import { Search, Users, MessageCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { getUserProfileByUsername } from "@/services/user/user.service.js";
import { useRouter } from "next/navigation";

export default function FindUsersPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⭐ Debounce Search — Wait 300ms
  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await getUserProfileByUsername(search);
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div
      className={`w-full min-h-screen flex justify-center transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-zinc-900 to-black text-gray-100"
          : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`w-full max-w-2xl p-6 shadow-xl border sm:rounded-2xl transition ${
          theme === "dark"
            ? "bg-zinc-900/60 border-zinc-800 backdrop-blur-xl"
            : "bg-white border-gray-300"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 opacity-80" />
            Find Users
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition ${
              theme === "dark"
                ? "bg-zinc-800/70 border-zinc-700 text-gray-100 placeholder-gray-500 focus:ring-gray-500"
                : "bg-white border-gray-300 text-black placeholder-gray-400 focus:ring-gray-900"
            }`}
          />
        </div>

        {/* Results */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-center py-10 text-lg opacity-60">Searching...</p>
          ) : results.length === 0 ? (
            <p className="text-center py-10 text-lg opacity-60">
              No users found
            </p>
          ) : (
            results.map((u) => (
              <div
                key={u?._id}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${
                  theme === "dark"
                    ? "bg-zinc-800/80 border-zinc-700 hover:bg-zinc-700/70 hover:border-gray-600"
                    : "bg-white border-gray-300 hover:bg-gray-200"
                }`}
              >
                {/* LEFT: Avatar + name */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold shadow-inner ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-zinc-700 to-zinc-600 text-gray-200"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {u.username?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  <div className="text-left">
                    <p className="font-semibold text-lg">{u?.username}</p>
                    <p className="text-sm opacity-70">{u?.fullname}</p>
                  </div>
                </div>

                {/* RIGHT: Message Button */}
                <button
                  onClick={() => router.push(`/home?id=${u.userId}`)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  Message
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
