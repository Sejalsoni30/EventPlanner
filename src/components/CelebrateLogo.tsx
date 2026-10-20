import React from "react";

interface CelebrateLogoProps {
  className?: string;
  size?: number; // size in pixels, default 36
  showGlow?: boolean;
}

export const CelebrateLogo: React.FC<CelebrateLogoProps> = ({
  className = "",
  size = 36,
  showGlow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="CelebrateAI Celebration Emblem"
    >
      {showGlow && (
        <div
          className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-md pointer-events-none transition-all duration-500"
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative drop-shadow-md transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1a33" />
            <stop offset="50%" stopColor="#0d0e18" />
            <stop offset="100%" stopColor="#08080f" />
          </linearGradient>

          <linearGradient id="logoBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#d97706" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="logoGoldCore" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#fef08a" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          <linearGradient id="logoSecFlare" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.7" />
          </linearGradient>

          <radialGradient id="logoCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#d97706" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Squircle Base with Gold Border */}
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="16"
          fill="url(#logoBgGrad)"
          stroke="url(#logoBorderGrad)"
          strokeWidth="1.75"
        />

        {/* Center Glow */}
        <circle cx="32" cy="32" r="26" fill="url(#logoCenterGlow)" />

        {/* Celestial Orbit Ring */}
        <circle
          cx="32"
          cy="32"
          r="22"
          stroke="url(#logoGoldCore)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          strokeOpacity="0.45"
        />

        {/* Diagonal Secondary 4-Point Star */}
        <g transform="rotate(45 32 32)">
          <path
            d="M 32 15 Q 32 32 15 32 Q 32 32 32 49 Q 32 32 49 32 Q 32 32 32 15 Z"
            fill="url(#logoSecFlare)"
          />
        </g>

        {/* Primary Majestic 4-Point Celebration Star */}
        <path
          d="M 32 8 Q 32 32 8 32 Q 32 32 32 56 Q 32 32 56 32 Q 32 32 32 8 Z"
          fill="url(#logoGoldCore)"
        />

        {/* Corner Celebration Sparkles */}
        <path
          d="M 17 14 Q 17 17 14 17 Q 17 17 17 20 Q 17 17 20 17 Q 17 17 17 14 Z"
          fill="#fde68a"
          opacity="0.85"
        />
        <path
          d="M 47 14 Q 47 17 44 17 Q 47 17 47 20 Q 47 17 50 17 Q 47 17 47 14 Z"
          fill="#fde68a"
          opacity="0.85"
        />
        <path
          d="M 17 44 Q 17 47 14 47 Q 17 47 17 50 Q 17 47 20 47 Q 17 47 17 44 Z"
          fill="#fde68a"
          opacity="0.7"
        />
        <path
          d="M 47 44 Q 47 47 44 47 Q 47 47 47 50 Q 47 47 50 47 Q 47 47 47 44 Z"
          fill="#fde68a"
          opacity="0.7"
        />

        {/* Center Diamond Core Jewel */}
        <circle cx="32" cy="32" r="4" fill="#ffffff" />
        <circle cx="32" cy="32" r="2" fill="#fffbeb" />
      </svg>
    </div>
  );
};
