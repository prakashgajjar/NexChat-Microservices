"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getAllUsers } from "@/services/user/user.service.js";
import { useAppContext } from "@/context/AppContext.context.js";


export default function ChatList() {
  const { theme } = useTheme();
  const { selectedUser, setSelectedUser } = useAppContext();
  const [users, setUsers] = useState([]);

  const isDark = theme === "dark";

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await getAllUsers();
        console.log(res);
        setUsers(res);

      } catch (error) {
        console.log(error.message);
      }
    }
    loadUsers();
  }, []);

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

        {/* Search */}
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

      {/* Users List */}
      <div className="overflow-y-auto flex-1">
        {users.length === 0 && (
          <div className="text-center text-gray-500 py-6 text-sm">
            No users found
          </div>
        )}

        {users.map((u) => {
          const isSelected = selectedUser?._id === u._id;

          return (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)} // ✅ select full user
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
              {/* Avatar */}
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
