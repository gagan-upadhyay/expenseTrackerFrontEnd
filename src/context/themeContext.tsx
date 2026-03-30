'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUser } from "./userContext";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  clearTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
  clearTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { loading, setUserTheme, userTheme, user } = useUser();

  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // 🔥 Apply theme to DOM (IMPORTANT)
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  };

  // 🚀 Initial load
  useEffect(() => {
    setMounted(true);

    if (user && !loading) {
      setTheme(userTheme as Theme);
      localStorage.setItem("theme", userTheme);
      applyTheme(userTheme as Theme);
    } else {
      const stored = localStorage.getItem("theme") as Theme | null;

      if (stored) {
        setTheme(stored);
        applyTheme(stored);
      } else {
        // fallback → system preference
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const systemTheme: Theme = systemDark ? "dark" : "light";

        setTheme(systemTheme);
        applyTheme(systemTheme);
      }
    }
  }, [user, userTheme, loading]);

  // 🔁 Toggle theme
  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "light" ? "dark" : "light";

    setTheme(next);
    applyTheme(next);

    if (user) {
      setUserTheme(next);
    }

    localStorage.setItem("theme", next);
  }, [theme, user, setUserTheme]);

  // 🧹 Clear theme (reset to system)
  const clearTheme = useCallback(() => {
    localStorage.removeItem("theme");

    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const systemTheme: Theme = systemDark ? "dark" : "light";

    setTheme(systemTheme);
    applyTheme(systemTheme);
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      clearTheme,
    }),
    [theme, toggleTheme, clearTheme]
  );

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be within ThemeProvider");
  return context;
};