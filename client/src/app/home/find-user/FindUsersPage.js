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

  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await getUserProfileByUsername(search);
        setResults(data || []);
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
      className={`p-2 min-h-screen w-full flex flex-col items-center ${
        theme === "dark" ? "bg-zinc-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Search Bar */}
      <div className="w-[800px] h-screen overflow-hidden border p-3  border-white/20 rounded-xl">
        <div className="relative mb-6  ">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none ${
              theme === "dark"
                ? "bg-zinc-800 border-zinc-700 text-white"
                : "bg-white border-gray-300"
            }`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Results List */}
        <div className="space-y-4 pr-1">
          {loading ? (
            <p className="text-center py-10 opacity-60">Searching...</p>
          ) : results.length === 0 ? (
            <p className="text-center py-10 opacity-60">No users found</p>
          ) : (
            results.map((u) => (
              <div
                key={u?._id}
                className={`flex items-center justify-between p-4 rounded-xl border shadow-sm cursor-pointer transition ${
                  theme === "dark"
                    ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                    : "bg-white border-gray-300 hover:bg-gray-200"
                }`}
              >
                {/* LEFT: Avatar + Info */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold ${
                      theme === "dark"
                        ? "bg-zinc-700 text-gray-200"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {u?.username?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  <div className="text-left">
                    <p className="font-semibold text-lg">{u?.username}</p>
                    <p className="text-sm opacity-70">{u?.fullname}</p>
                  </div>
                </div>

                {/* RIGHT: Message Button */}
                <button
                  onClick={() => router.push(`/home?id=${u?.userId}`)}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition"
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
