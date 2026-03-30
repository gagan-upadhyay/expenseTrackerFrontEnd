'use client';

import { useTheme } from "@/src/context/themeContext";
import clsx from "clsx";

export default function ToggleTheme() {
  const { toggleTheme, theme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "p-2 rounded-full transition-colors",
        theme === "dark" ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-800"
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}