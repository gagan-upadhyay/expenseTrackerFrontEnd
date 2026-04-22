'use client';

import {
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {  useRouter } from "next/navigation";
import ToggleTheme from "../dashboard/ToggleTheme";
import { toastShowLoading, toastShowSuccess } from "@/src/utils/toastUtils";
import { useAuth } from "@/src/context/authContext";
import { useTheme } from "@/src/context/themeContext";
import { logoutUser } from "@/src/services/authService";

export default function SideBarActions({ expanded }: { expanded: boolean }) {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const { toggleTheme, theme } = useTheme();
  const isExpanded = expanded;

  const handleLogout = async () => {
    try {
      const response: { success: boolean; message: string } = (await logoutUser()) as {
        success: boolean;
        message: string;
      };

      if (response.success) {
        logout();
        router.replace("/");
      }
    } catch (err) {
      console.warn("Error in logout:", err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Theme Toggle */}
      {isExpanded ? (
        <div className={clsx(
          "flex items-center justify-between gap-2 p-3 rounded-lg",
          "bg-slate-100 dark:bg-slate-800",
          "border border-slate-200 dark:border-slate-700",
          "transition-all duration-200"
        )}>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Theme
          </span>
          <button
            onClick={toggleTheme}
            className={clsx(
              "relative w-12 h-6 rounded-full flex items-center px-1",
              "transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500",
              theme === "dark" ? "bg-indigo-600" : "bg-slate-300"
            )}
            aria-label="Toggle theme"
          >
            <span className="absolute left-1 text-xs">☀️</span>
            <span className="absolute right-1 text-xs">🌙</span>
            <div
              className={clsx(
                "w-4 h-4 rounded-full bg-white shadow-md z-10",
                "transition-all duration-300",
                theme === "dark" ? "translate-x-6" : "translate-x-0"
              )}
            />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <ToggleTheme />
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={() => {
          const toastID = toastShowLoading("Logging out...");
          if (isLoggedIn) {
            setTimeout(() => {
              handleLogout();
              toastShowSuccess("Logged out Successfully", 600, String(toastID));
            }, 1200);
          } else {
            router.replace("/auth/login");
          }
        }}
        className={clsx(
          "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg",
          "text-slate-600 dark:text-slate-400",
          "hover:text-slate-900 dark:hover:text-white",
          "hover:bg-slate-100 dark:hover:bg-slate-800",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500",
          !isExpanded && "justify-center"
        )}
      >
        <ArrowRightEndOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
        {isExpanded && (
          <span className="text-sm font-medium whitespace-nowrap">Logout</span>
        )}
      </button>
    </div>
  );
}
