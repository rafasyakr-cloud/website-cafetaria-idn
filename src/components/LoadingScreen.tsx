"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Menyeduh Biji Kopi Nusantara...");
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Stage 1: Progress Increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate smoothly
        const increment = prev < 50 ? Math.floor(Math.random() * 8) + 4 : Math.floor(Math.random() * 12) + 6;
        return Math.min(100, prev + increment);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress > 30 && progress <= 65) {
      setLoadingText("Menata Kenyamanan Ruang & Fasilitas...");
    } else if (progress > 65 && progress < 100) {
      setLoadingText("Menyiapkan Cita Rasa Terbaik...");
    } else if (progress >= 100) {
      setLoadingText("Selamat Datang di Cafetaria IDN");
      const timer = setTimeout(() => {
        setIsLoaded(true);
        setTimeout(() => setShouldRender(false), 700); // Wait for fade-out
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden={isLoaded}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface transition-all duration-700 ease-in-out ${
        isLoaded ? "opacity-0 pointer-events-none scale-105" : "opacity-100 pointer-events-auto scale-100"
      }`}
    >
      {/* Background Decorative Ambient Warm Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -top-10 -right-10" />
      <div className="absolute w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none -bottom-10 -left-10" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        {/* Brand Logo with Soft Breathing Glow */}
        <div className="relative h-14 w-44 animate-pulse">
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Animated Artisan Steaming Cup SVG */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-primary drop-shadow-sm"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Rising Steam Waves */}
            <path
              d="M22 14C22 10 26 8 26 4"
              stroke="#845000"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-[steam_1.8s_ease-in-out_infinite]"
            />
            <path
              d="M32 16C32 11 36 9 36 3"
              stroke="#c27803"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-[steam_1.5s_ease-in-out_infinite_0.3s]"
            />
            <path
              d="M42 14C42 10 46 8 46 4"
              stroke="#845000"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-[steam_2s_ease-in-out_infinite_0.6s]"
            />

            {/* Coffee Cup Body */}
            <path
              d="M12 24H52V40C52 48.8366 44.8366 56 36 56H28C19.1634 56 12 48.8366 12 40V24Z"
              fill="#2b1810"
              stroke="#845000"
              strokeWidth="2"
            />
            {/* Cup Handle */}
            <path
              d="M52 28H56C58.2091 28 60 29.7909 60 32V38C60 40.2091 58.2091 42 56 42H50"
              stroke="#845000"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Saucer */}
            <path
              d="M8 58H56"
              stroke="#845000"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-56 sm:w-64 space-y-2">
          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden p-0.5 border border-outline-variant/30">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-crema rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface-variant font-mono">
            <span>{progress}%</span>
            <span className="text-primary tracking-wider uppercase text-[10px]">Memuat</span>
          </div>
        </div>

        {/* Subtitle / Status Text */}
        <p className="text-xs sm:text-sm font-medium text-on-surface-variant tracking-wide min-h-[20px] transition-all duration-300">
          {loadingText}
        </p>
      </div>
    </div>
  );
}

