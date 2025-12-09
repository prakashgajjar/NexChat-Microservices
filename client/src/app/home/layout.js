"use client";

import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext.context.js";
import { useEffect } from "react";
import { getMe } from "@/services/user/user.service.js";

export default function RootLayout({ children }) {
  const { setCurrentUser } = useAppContext();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getMe();
        setCurrentUser(res);
        // console.log("Fetched user ID:", res);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <html lang="en">
      <body className={` antialiased`}>
        <div className="flex w-screen h-screen">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
