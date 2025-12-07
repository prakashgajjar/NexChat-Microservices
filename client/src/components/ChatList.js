"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useTheme } from "../context/ThemeContext";
import { getContacts } from "@/services/user/user.service.js";
import { useAppContext } from "@/context/AppContext.context.js";
import { useSearchParams, useRouter } from "next/navigation";

let socket;

export default function ChatList() {
  const { theme } = useTheme();
  const { selectedUser, setSelectedUser, currentUser } = useAppContext();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [search, setSearch] = useState(""); 

  const isDark = theme === "dark";
  const searchParams = useSearchParams();
  const userIdFromURL = searchParams.get("id");

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await getContacts();
        // console.log("Contacts fetched:", res);

        const unique = Array.from(
          new Map(res.map((u) => [u.userId, u])).values()
        );

        setUsers(unique);
      } catch (error) {
        console.log(error.message);
      }
    }
    loadUsers();
  }, []);

  useEffect(() => {
    if (!userIdFromURL || users.length === 0) return;

    const found = users.find((u) => u.userId === userIdFromURL);

    if (found) setSelectedUser(found);
  }, [userIdFromURL, users]);

  useEffect(() => {
    if (!currentUser?.userId) return;

    const URL = process.env.NEXT_PUBLIC_BACKEND_URL_REALTIME;

    socket = io(URL, {
      transports: ["websocket"],
      query: { userId: currentUser.userId },
    });

    socket.on("online-users", (list) => setOnlineUsers(list));
    socket.on("user-online", (id) =>
      setOnlineUsers((prev) => [...new Set([...prev, id])])
    );
    socket.on("user-offline", (id) =>
      setOnlineUsers((prev) => prev.filter((u) => u !== id))
    );

    return () => socket.disconnect();
  }, [currentUser?.userId]);

  const filteredUsers = users.filter((u) => {
    const name = (u.fullname || "").toLowerCase();
    const username = (u.username || "").toLowerCase();
    const q = search.toLowerCase();

    return (
      name.includes(q) ||
      username.includes(q) ||
      ("@" + username).includes(q)
    );
  });

  return (
    <div
      className={`w-80 flex flex-col border-r transition-all duration-300 
        ${
          isDark
            ? "bg-zinc-900 border-zinc-800 text-gray-100"
            : "bg-white border-gray-200 text-zinc-800"
        }
      `}
    >
      {/* Header */}
      <div
        className={`p-4 border-b ${
          isDark
            ? "border-zinc-800 bg-zinc-900/60 backdrop-blur-sm"
            : "border-gray-200 bg-white/50 backdrop-blur-sm"
        }`}
      >
        <h1 className="text-3xl font-bold mb-2">NexChat</h1>
        <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs`}>
          End-to-end encrypted chat
        </p>

        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`mt-3 w-full p-2 rounded-lg text-sm outline-none transition 
            ${
              isDark
                ? "bg-zinc-800 text-gray-200 border border-zinc-700"
                : "bg-gray-100 text-gray-800 border border-gray-300"
            }
          `}
        />
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 py-6 text-sm">
            No contacts found
          </div>
        )}

        {filteredUsers.map((u, index) => {
          const isSelected = selectedUser?.userId === u.userId;
          const isOnlineNow = onlineUsers.includes(u.userId);

          return (
            <div
              key={u._id || index}
              onClick={() => {
                setSelectedUser(u);
                router.replace(`/home?id=${u.userId}`);
              }}
              className={`flex items-center gap-3 p-3 border-b cursor-pointer transition-all
              ${
                isSelected
                  ? isDark
                    ? "bg-zinc-700/50 border-l-4 border-blue-500"
                    : "bg-blue-50 border-l-4 border-blue-500"
                  : isDark
                  ? "hover:bg-zinc-800"
                  : "hover:bg-gray-100"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow 
                    ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                    }
                  `}
                >
                  {(u.fullname || u.username)?.charAt(0)?.toUpperCase()}
                </div>

                {isOnlineNow && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold">
                  {u.fullname || u.username}
                </p>

                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  @{u.username}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
