"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <AppContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
