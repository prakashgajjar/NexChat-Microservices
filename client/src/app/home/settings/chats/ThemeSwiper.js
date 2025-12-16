"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, X, Plus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { updateChatBgUrl } from "@/services/ui/Theme.ui";

const INITIAL_BACKGROUNDS = [
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861344/w6_f6v4no.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861355/bg36_fr7ayj.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861252/bg20_xfdl0b.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861227/bg40_howbcy.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861215/image001_uljxww.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861220/image002_f1lxbi.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861163/bg37_pu9m7v.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861149/bg33_xynsuo.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861137/bg38_os1owb.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861132/bg34_xkf1cr.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861128/bg31_yyzn4a.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765861120/bg23_dtlzsi.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765860977/bg12_hbqwk3.jpg",
  "https://res.cloudinary.com/dsndcjfwh/image/upload/v1765860974/bg06_r9eptq.jpg",
];

export default function ThemeSwiper() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [backgrounds, setBackgrounds] = useState(INITIAL_BACKGROUNDS);
  const [currentBg, setCurrentBg] = useState(""); // ✅ ACTIVE BG
  const [preview, setPreview] = useState(null);
  const [customUrl, setCustomUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const endRef = useRef(null);

  /* Infinite horizontal scroll */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBackgrounds((prev) => [...prev, ...INITIAL_BACKGROUNDS]);
        }
      },
      { rootMargin: "200px" }
    );

    if (endRef.current) observer.observe(endRef.current);
    return () => observer.disconnect();
  }, []);

  /* Add custom background */
  const addCustomBg = () => {
    if (!customUrl.trim()) return;
    setBackgrounds((prev) => [customUrl.trim(), ...prev]);
    setCustomUrl("");
  };

  /* ✅ SAVE BACKGROUND */
  const handleSetBackground = async () => {
    if (!preview) return;

    try {
      setSaving(true);

      await updateChatBgUrl(preview);

      // ✅ Local state becomes source of truth
      setCurrentBg(preview);
      setPreview(null);
    } catch (err) {
      console.error(err?.message || "Failed to update background");
      alert("Failed to update background. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="font-medium mb-3">Chat background</h2>

      {/* Add URL */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Add custom background
        </label>

        <div
          className={`
            flex items-center gap-2 rounded-2xl border px-3 py-2 transition
            ${
              isDark
                ? "bg-zinc-800 border-zinc-600"
                : "bg-gray-200 border-gray-300"
            }
            focus-within:ring-2 focus-within:ring-blue-500
          `}
        >
          <input
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className="flex-1 bg-transparent outline-none text-sm"
          />

          <button
            onClick={addCustomBg}
            disabled={!customUrl}
            className="
              h-9 w-9 rounded-xl bg-blue-600 text-white
              hover:bg-blue-700 disabled:opacity-40
            "
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Swiper */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
        {backgrounds.map((bg, i) => {
          const active = currentBg === bg;

          return (
            <button
              key={`${bg}-${i}`}
              onClick={() => setPreview(bg)}
              className={`
                snap-center relative min-w-[140px] h-28
                rounded-2xl overflow-hidden
                ${active ? "ring-2 ring-blue-500" : ""}
              `}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bg})` }}
              />

              {active && (
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <Check className="w-7 h-7 text-white" />
                </div>
              )}
            </button>
          );
        })}

        <div ref={endRef} className="min-w-[1px]" />
      </div>

      {/* Preview */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div
            className="relative w-full h-full"
            style={{
              backgroundImage: `url(${preview})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => setPreview(null)}
                disabled={saving}
                className={`
                  px-5 py-2.5 rounded-full border backdrop-blur-md
                  ${isDark
                    ? "bg-zinc-900/70 text-white border-zinc-700"
                    : "bg-white/70 text-gray-800 border-gray-200"}
                `}
              >
                <X size={18} /> Cancel
              </button>

              <button
                onClick={handleSetBackground}
                disabled={saving}
                className="px-5 py-2.5 rounded-full bg-emerald-600 text-white"
              >
                {saving ? "Saving..." : <><Check size={18} /> Set Background</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
