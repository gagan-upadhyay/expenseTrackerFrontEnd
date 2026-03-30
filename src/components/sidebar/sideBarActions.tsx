'use client';

import {

  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
// import Link from "next/link";
import {  useRouter } from "next/navigation";
import ToggleTheme from "../dashboard/ToggleTheme";
import { toastShowLoading, toastShowSuccess } from "@/src/utils/toastUtils";
import { useAuth } from "@/src/context/authContext";
import { useTheme } from "@/src/context/themeContext";
import { logoutUser } from "@/src/services/authService";




export default function SideBarActions({ expanded }: { expanded: boolean }) {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  // const pathname = usePathname();
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
    <div className="">
      <div className="mt-3 flex items-center px-4">
        {isExpanded ? (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/10 p-2">
            <span className="text-xs">Theme</span>
            <button
              onClick={toggleTheme}
              className={clsx(
                "relative w-14 h-7 rounded-full flex items-center px-1",
                "transition-all duration-500",
                theme === "dark" ? "bg-indigo-500" : "bg-gray-300"
              )}
            >
              <span className="absolute left-2 text-xs">🌞</span>
              <span className="absolute right-2 text-xs">🌙</span>
              <div
                className={clsx(
                  "w-5 h-5 rounded-full bg-white shadow-md z-10",
                  "transition-all duration-500",
                  theme === "dark" ? "translate-x-7" : "translate-x-0"
                )}
              />
            </button>
          </div>
        ) : (
          <ToggleTheme />
        )}
      </div>
      <div className="mt-5 p-2 border-t border-white/10">
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
            "flex w-full items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10",
            "transition-all duration-200"
          )}
        >
          <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
          <span className={clsx("transition-all duration-200 whitespace-nowrap", isExpanded ? "opacity-100" : "opacity-0")}>Logout</span>
        </button>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
}
