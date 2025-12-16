"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { updateTheme } from "@/services/ui/Theme.ui.js";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  // Load theme from cookies on first render
  useEffect(() => {
    const savedTheme = Cookies.get("UUI_theme");
    // console.log("savedTheme", savedTheme)

    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Toggle theme and sync with backend + cookies
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Update UI instantly
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    // Update cookie
    Cookies.set("UUI_theme", newTheme, { path: "/" });

    // Update backend DB & backend cookie
    try {
      const res = await updateTheme(newTheme);
      console.log("Backend theme update:", res);
    } catch (error) {
      console.error("Error updating theme in backend:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
