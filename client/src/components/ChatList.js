"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useTheme } from "../context/ThemeContext";
import { getAllUsers } from "@/services/user/user.service.js";
import { useAppContext } from "@/context/AppContext.context.js";
import { useSearchParams, useRouter } from "next/navigation";

let socket;

export default function ChatList() {
  const { theme } = useTheme();
  const { selectedUser, setSelectedUser, currentUser } = useAppContext();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const isDark = theme === "dark";

  // ⭐ Read ID from URL query
  const searchParams = useSearchParams();
  const userIdFromURL = searchParams.get("id");

  /* ----------------------------------------------------
     LOAD ALL USERS ONCE
  ---------------------------------------------------- */
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await getAllUsers();
        setUsers(res);
      } catch (error) {
        console.log(error.message);
      }
    }
    loadUsers();
  }, []);

  /* ----------------------------------------------------
     AUTO-SELECT USER FROM URL WHEN USERS LOADED
  ---------------------------------------------------- */
  useEffect(() => {
    if (!userIdFromURL || users.length === 0) return;

    const found = users.find((u) => u.userId === userIdFromURL);

    if (found) {
      setSelectedUser(found);
    }
  }, [userIdFromURL, users]);

  /* ----------------------------------------------------
     REAL-TIME ONLINE / OFFLINE TRACKING
  ---------------------------------------------------- */
  useEffect(() => {
    if (!currentUser?.userId) return;

    const URL = process.env.NEXT_PUBLIC_BACKEND_URL_REALTIME;

    socket = io(URL, {
      transports: ["websocket"],
      query: { userId: currentUser.userId },
    });

    socket.on("online-users", (list) => {
      setOnlineUsers(list);
    });

    socket.on("user-online", (userId) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("user-offline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => socket.disconnect();
  }, [currentUser?.userId]);

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
      {/* HEADER */}
      <div
        className={`p-4 border-b ${
          isDark
            ? "border-zinc-800 bg-zinc-900/60 backdrop-blur-sm"
            : "border-gray-200 bg-white/50 backdrop-blur-sm"
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-2 bg-linear-to-r ${
            isDark ? "from-gray-300 to-gray-500" : "from-zinc-700 to-zinc-500"
          } text-transparent bg-clip-text`}
        >
          NexChat
        </h1>

        <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs`}>
          End-to-end encrypted distributed chat
        </p>

        <input
          type="text"
          placeholder="Search"
          className={`mt-3 w-full p-2 rounded-lg text-sm outline-none transition 
            ${
              isDark
                ? "bg-zinc-800 text-gray-200 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-100 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-400"
            }
          `}
        />
      </div>

      {/* USER LIST */}
      <div className="overflow-y-auto flex-1">
        {users.length === 0 && (
          <div className="text-center text-gray-500 py-6 text-sm">
            No users found
          </div>
        )}

        {users.map((u) => {
          const isSelected = selectedUser?.userId === u.userId;
          const isOnlineNow = onlineUsers.includes(u.userId);

          return (
            <div
              key={u._id}
              onClick={() => {
                setSelectedUser(u);
                router.replace(`/home?id=${u.userId}`); // ⭐ UPDATE URL
              }}
              className={`flex items-center gap-3 p-3 border-b border-gray-700/20 cursor-pointer transition-all
                ${
                  isSelected
                    ? isDark
                      ? "bg-zinc-700/50 border-l-4 border-blue-500"
                      : "bg-blue-50 border-l-4 border-blue-500"
                    : isDark
                    ? "hover:bg-zinc-800"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {/* Avatar + Online Dot */}
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
                  {u.username?.charAt(0)?.toUpperCase()}
                </div>

                {isOnlineNow && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <p className="font-semibold">{u.username}</p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {u.email}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
