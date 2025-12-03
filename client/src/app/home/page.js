"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import { ThemeProvider } from "@/context/ThemeContext";
import { chats, messages } from "@/data/mockData";


export default function App() {
  const [selectedChat, setSelectedChat] = useState("Alice");

  return (
    <ThemeProvider>
      <div className="flex h-screen">
        <Sidebar />
        <ChatList chats={chats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        <ChatWindow selectedChat={selectedChat} messages={messages} />
      </div>
    </ThemeProvider>
  );
}
