"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isBgAvailable , setIsBgAvailable] = useState("");

  return (
    <AppContext.Provider value={{ selectedUser, setSelectedUser, currentUser, setCurrentUser, isBgAvailable , setIsBgAvailable }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
