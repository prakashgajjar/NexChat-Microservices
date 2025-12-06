"use client";

import { useState } from "react";
import { checkUsername, setUsername } from "@/services/auth/auth.service";
import { AuthLoader } from "@/components/Auth/AuthLoader";

export default function UsernamePage({ onSuccess }) {
  const [usernameState, setUsernameState] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [available, setAvailable] = useState(null);

  // Same rule as backend
  const validate = (name) => /^[A-Za-z0-9._]{6,20}$/.test(name);

  const handleCheck = async (e) => {
    e.preventDefault();
    setError("");
    setAvailable(null);

    if (!validate(usernameState)) {
      setError("Username must be 6–20 chars, letters/numbers/._ only");
      return;
    }

    setChecking(true);

    const res = await checkUsername(usernameState);

    if (res.success && res.available) {
      setAvailable(true);
    } else {
      setAvailable(false);
      setError(res.message);
    }

    setChecking(false);
  };

  const handleContinue = async () => {
    if (!available) return;

    setLoading(true);

    const res = await setUsername(usernameState);

    if (!res.success) {
      setError(res.message);
      setLoading(false);
      return;
    }

    // Callback + redirect
    onSuccess?.(usernameState);
    window.location.href = "/auth/signup?username=" + usernameState;
  };

  return (
    <div className="relative min-h-screen bg-linear-to-r from-black to-zinc-800 flex items-center justify-center px-4 text-white">
      
      {/* Global loader when saving username */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
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
          Pick a unique username
        </p>

        {/* Username Form */}
        <form onSubmit={handleCheck} className="space-y-5">
          <input
            type="text"
            placeholder="Choose a username"
            className="w-full p-3 bg-neutral-800/70 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={usernameState}
            onChange={(e) => {
              setUsernameState(e.target.value.toLowerCase());
              setAvailable(null);
              setError("");
            }}
          />

          {/* Button text changes based on state */}
          <button
            type="submit"
            disabled={checking}
            className="w-full py-3 rounded-xl bg-linear-to-r from-zinc-700 to-zinc-800 font-semibold transition-all active:scale-95 shadow-md"
          >
            {available === true ? "Change Username" : "Check Availability"}
          </button>
        </form>

        {/* Status Message */}
        {available === true && (
          <p className="text-green-400 mt-4 text-center">✔ Username is available</p>
        )}

        {available === false && (
          <p className="text-red-400 mt-4 text-center">✖ Username already taken</p>
        )}

        {/* Error */}
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

        {/* Continue Button */}
        {available === true && (
          <button
            onClick={handleContinue}
            className="mt-6 w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 font-semibold active:scale-95 transition-all shadow-lg"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
