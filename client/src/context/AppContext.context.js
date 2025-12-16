"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isBgAvailable, setIsBgAvailable] = useState("");
  const [isScreenAbout, setIsScreenAbout] = useState({
    isContact: true,
    isSetting: false,
    isSearch: false,
    isGroup: false,
  });

  return (
    <AppContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        currentUser,
        setCurrentUser,
        isBgAvailable,
        setIsBgAvailable,
        isScreenAbout,
        setIsScreenAbout
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
