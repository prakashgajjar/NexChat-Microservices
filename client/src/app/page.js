"use client";
import { useEffect } from "react";
import LoginPage from "../components/Auth/LoginPage.js"
import { refreshToken } from "@/services/token/refreshToken.token.js";


export default function App() {

useEffect(() => {
  // console.log("useEffect running...");
  refreshToken();
}, []);


  return (
    <div>
          <LoginPage/>
    </div>
  );
}
