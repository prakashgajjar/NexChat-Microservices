"use client";

import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext.context.js";
import { useEffect, useRef, useState } from "react";
import { getMe } from "@/services/user/user.service.js";
import ListMain from "@/components/ListMain";

export default function HomeLayout({ children }) {
  const { setCurrentUser, setIsBgAvailable } = useAppContext();

  const [chatListWidth, setChatListWidth] = useState(() => {
    if (typeof window === "undefined") return 360;
    const saved = localStorage.getItem("chatListWidth");
    return saved ? Number(saved) : 360;
  });
  const isResizing = useRef(false);

  useEffect(() => {
    async function fetchData() {
      const res = await getMe();
      // console.log("userres",res)
      setCurrentUser(res);
      setIsBgAvailable(res.ui.chatBgUrl);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("chatListWidth", chatListWidth.toString());
  }, [chatListWidth]);

  const startResize = () => (isResizing.current = true);
  const stopResize = () => (isResizing.current = false);

  const handleResize = (e) => {
    if (!isResizing.current) return;

    const newWidth = e.clientX - 80; // sidebar width
    if (newWidth >= 280 && newWidth <= 580) {
      setChatListWidth(newWidth);
    }
  };

  return (
    <div
      className="flex w-screen h-screen overflow-hidden"
      onMouseMove={handleResize}
      onMouseUp={stopResize}
      onMouseLeave={stopResize}
    >
      <Sidebar />

      <div style={{ width: chatListWidth }} className="shrink-0">
        <ListMain />
      </div>

      <div
        onMouseDown={startResize}
        className="w-[2px] cursor-col-resize hover:bg-blue-500/40"
      />

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
