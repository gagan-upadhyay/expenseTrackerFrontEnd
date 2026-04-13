'use client';

import { useTheme } from "@/src/context/themeContext";

export default function SettingThemes() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between items-center">
      <span>Theme</span>

      <button
        onClick={toggleTheme}
        className="px-3 py-1 rounded-md border"
      >
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
}