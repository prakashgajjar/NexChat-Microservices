"use client";

import { useState } from "react";
import { loginUser } from "@/services/auth/auth.service.js";
import { AuthLoader } from "../Auth/AuthLoader.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (e) => /\S+@\S+\.\S+/.test(e);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) return setError("Invalid email");
    if (password.length < 6) return setError("Password too short");

    setLoading(true);

    try {
      const result = await loginUser({ email, password });
      if (result.status === 200) {
        window.location.href = "/home";
      }
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-r from-black to-zinc-800 flex items-center justify-center px-4 text-white">
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <AuthLoader />
        </div>
      )}

      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-md 
        p-8 rounded-2xl border border-neutral-700 shadow-xl">

        {/* Branding */}
        <h1 className="text-center text-4xl font-extrabold mb-2 bg-linear-to-r from-gray-800 to-blue-100 text-transparent bg-clip-text">
          NexChat
        </h1>
        <p className="text-center text-neutral-400 mb-8">
          Welcome back - please sign in
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-neutral-800/70 border border-neutral-700 
              rounded-xl focus:ring-2 focus:ring-blue-500 outline-none 
              transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-neutral-800/70 border border-neutral-700 
              rounded-xl focus:ring-2 focus:ring-purple-500 outline-none 
              transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-linear-to-r 
            from-zinc-700 to-zinc-800 font-semibold transition-all
            
            active:scale-95 shadow-md"
          >
            Login
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="text-red-400 mt-4 text-center">{error}</p>
        )}

        <p className="text-center mt-6 text-neutral-400">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-blue-400 underline hover:text-blue-300">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
