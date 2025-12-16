"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, X, Plus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const INITIAL_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=600",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600",
  "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=600",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
];

export default function ThemeSwiper({ selectedBg, onSelect }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [backgrounds, setBackgrounds] = useState(INITIAL_BACKGROUNDS);
  const [preview, setPreview] = useState(null);
  const [customUrl, setCustomUrl] = useState("");

  const endRef = useRef(null);

  /* Infinite scroll (horizontal) */
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

  return (
    <div className="w-full">
      <h2 className="font-medium mb-3">Chat background</h2>

      {/* Add URL */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Add custom background
        </label>

        <div
          className={`      flex items-center gap-2
      rounded-2xl border
      bg-white 
      border-gray-200 
      px-3 py-2
       ${
         isDark ? "bg-zinc-800 border-gray-400" : "bg-gray-200 border-gray-400 "
       }
      focus-within:ring-2 focus-within:ring-blue-500
      transition
    `}
        >
          <input
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className={` flex-1 bg-transparent outline-none
             
        text-sm
        placeholder-gray-400`}
          />

          <button
            onClick={addCustomBg}
            disabled={!customUrl}
            className="
        flex items-center justify-center
        h-9 w-9
        rounded-xl
        bg-blue-600 text-white
        hover:bg-blue-700
        disabled:opacity-40 disabled:cursor-not-allowed
        transition
      "
            aria-label="Add background"
          >
            <Plus size={18} />
          </button>
        </div>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Recommended size: 1080×1920 • JPG / PNG
        </p>
      </div>

      {/* Swiper */}
      <div
        className="
          flex gap-4 overflow-x-auto scrollbar-hide
          snap-x snap-mandatory scroll-smooth
          pb-2
        "
      >
        {backgrounds.map((bg, i) => {
          const active = selectedBg === bg;

          return (
            <button
              key={`${bg}-${i}`}
              onClick={() => setPreview(bg)}
              className={`
                snap-center
                relative
                min-w-[140px] h-28
                rounded-2xl overflow-hidden
                transition-all
                ${active ? "ring-2 ring-blue-500" : ""}
              `}
            >
              {/* Lazy background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bg})` }}
                loading="lazy"
              />

              {active && (
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <Check className="w-7 h-7 text-white" />
                </div>
              )}
            </button>
          );
        })}

        {/* Infinite trigger */}
        <div ref={endRef} className="min-w-[1px]" />
      </div>

      {/* Fullscreen Preview */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div
            className="relative w-full h-full"
            style={{
              backgroundImage: `url(${preview})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Actions */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 rounded-full bg-white/90 flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={() => {
                  onSelect(preview);
                  setPreview(null);
                }}
                className="px-4 py-2 rounded-full bg-green-600 text-white flex items-center gap-2"
              >
                <Check size={18} /> Set Background
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
