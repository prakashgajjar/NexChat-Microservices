"use client";

import { useState } from "react";
import { getOtp } from "@/services/auth/auth.service.js";
import VerifyOtp from "@/components/Auth/VerifyOtp";
import Link from "next/link";
import { AuthLoader } from "@/components/Auth/AuthLoader"; // <-- ADD THIS IMPORT

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateEmail = (e) => /\S+@\S+\.\S+/.test(e);

  const nameError = name.length < 2 ? "Name must be at least 2 characters" : "";
  const emailError = !validateEmail(email) ? "Invalid email format" : "";
  const passwordError = password.length < 6 ? "Password must be at least 6 characters" : "";
  const confirmError = confirm !== password ? "Passwords do not match" : "";

  const isValid =
    nameError === "" &&
    emailError === "" &&
    passwordError === "" &&
    confirmError === "";

  const handleSignup = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!isValid) return;

    setLoading(true);

    try {
      const res = await getOtp({ email });
      setShowOtp(true);
    } catch (err) {
      setServerError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    window.location.href = "/home";
  };

  return (
    <div className="relative min-h-screen bg-linear-to-r from-black to-zinc-800 flex items-center justify-center px-4 text-white">

      {/* Auth Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <AuthLoader />   {/* <-- USED HERE */}
        </div>
      )}

      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-md 
        p-8 rounded-2xl border border-neutral-700 shadow-xl">

        {/* Branding */}
        <h1 className="text-center text-4xl font-extrabold mb-2 bg-linear-to-r from-gray-800 to-blue-100 text-transparent bg-clip-text">
          NexChat
        </h1>
        <p className="text-center text-neutral-400 mb-8">Create your account</p>

        {/* OTP Screen */}
        {showOtp ? (
          <VerifyOtp
            email={email}
            password={password}
            username={name}
            onSuccess={handleOtpSuccess}
          />
        ) : (
          <form onSubmit={handleSignup} className="space-y-5">

            {/* NAME */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 bg-neutral-800/70 border border-neutral-700 
                rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched({ ...touched, name: true })}
              />
              {touched.name && nameError && (
                <p className="text-red-400 text-sm mt-1">{nameError}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-neutral-800/70 border border-neutral-700 
                rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
              />
              {touched.email && emailError && (
                <p className="text-red-400 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 bg-neutral-800/70 border border-neutral-700 
                rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched({ ...touched, password: true })}
              />
              {touched.password && passwordError && (
                <p className="text-red-400 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 bg-neutral-800/70 border border-neutral-700 
                rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onBlur={() => setTouched({ ...touched, confirm: true })}
              />
              {touched.confirm && confirmError && (
                <p className="text-red-400 text-sm mt-1">{confirmError}</p>
              )}
            </div>

            {/* SERVER ERROR */}
            {serverError && (
              <p className="text-red-400 text-center text-sm">{serverError}</p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full py-3 rounded-xl bg-linear-to-r 
              from-zinc-700 to-zinc-800 font-semibold transition-all
              active:scale-95 disabled:opacity-50 shadow-md"
            >
              {loading ? "Sending OTP…" : "Create Account"}
            </button>

          </form>
        )}

        {/* Footer */}
        <p className="text-center mt-6 text-neutral-400">
          Already have an account?{" "}
          <Link href="/" className="text-blue-400 underline hover:text-blue-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
