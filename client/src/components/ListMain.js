"use client";

import React from "react";
import { usePathname } from "next/navigation";

import ChatList from "./ChatList";
import Setting from "./Setting";
import GroupList from "./GroupList";
import FindUserPage from "./FindUsersPage";

const ListMain = () => {
  const pathname = usePathname();

  if (pathname === "/home") {
    return <ChatList />;
  }

  if (pathname === "/home/find-user") {
    return <FindUserPage />;
  }

  if (pathname.startsWith("/home/settings")) {
    return <Setting />;
  }

  if (pathname === "/home/groups") {
    return <GroupList />;
  }

  return null;
};

export default ListMain;
