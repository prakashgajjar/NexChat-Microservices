"use client";

import { useState } from "react";
import { verifyOtp } from "@/services/auth/auth.service.js"; // <-- import your function

export default function VerifyOtp({ email, password, username, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  // LIVE VALIDATION
  const otpError =
    otp.length === 0 && touched
      ? "OTP is required"
      : otp.length < 4 && touched
      ? "Enter a valid 4-digit OTP"
      : "";

  const isValid = otpError === "";

 const handleVerify = async (e) => {
  e.preventDefault();
  setError("");

  // Only OTP validation
  if (!otp || otp.length < 4) {
    return setError("Please enter a valid 4-digit OTP");
  }

  setLoading(true);

  try {
    const response = await verifyOtp({
      email,
      otp,
      username,
      password,
    });

    if(response.status === 200){
      }
        onSuccess(); 

  } catch (err) {
    setError(err?.message || "OTP verification failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="space-y-4">
      <p className="text-neutral-300">
        OTP sent to <strong>{email}</strong>.
      </p>

      <form onSubmit={handleVerify} className="space-y-3">
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 bg-neutral-800 border border-neutral-600 rounded-xl"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
            setTouched(true);
          }}
          onBlur={() => setTouched(true)}
        />

        {otpError && <p className="text-red-400 text-sm">{otpError}</p>}

        {error && <p className="text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || !isValid}
          className="w-full bg-green-600 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}
