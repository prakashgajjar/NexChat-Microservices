"use client";

import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import { useEffect } from "react";
import { refreshToken } from "@/services/token/refreshToken.token.js";

export default function App() {
  useEffect(() => {
    console.log("Chat App Loaded");
    refreshToken();

  }, []);

  return (
    <div className="flex w-screen h-screen">
      <ChatList />
      <ChatWindow />
    </div>
  );
}
