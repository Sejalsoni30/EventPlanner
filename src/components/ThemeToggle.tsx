import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      id="theme-toggle-btn"
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode (Ivory Elegance)" : "Switch to Dark Mode (Midnight Obsidian)"}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-300 cursor-pointer ${
        isDark
          ? "bg-white/5 hover:bg-white/10 border-white/15 text-amber-200 hover:text-amber-100 shadow-sm"
          : "bg-amber-50 hover:bg-amber-100/80 border-amber-300/60 text-stone-900 shadow-sm"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25 }}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4 text-amber-600" aria-hidden="true" />
          )}
        </motion.div>
      </div>

      {showLabel && (
        <span className="hidden sm:inline font-medium">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
