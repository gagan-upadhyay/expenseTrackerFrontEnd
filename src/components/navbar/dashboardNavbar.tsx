'use client';

import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SIDEBAR_SECTIONS } from "../sidebar/sidebar.config";
import ToggleTheme from "../dashboard/ToggleTheme";
import { useTheme } from "@/src/context/themeContext";
import { useUser } from "@/src/context/userContext";
import LogoutButton from "../ui/buttons/logoutButton";
import { useAuth } from "@/src/context/authContext";
import Image from "next/image";

/**
 * Dashboard Navbar for desktop view
 * Shows navigation items horizontally instead of sidebar
 */
export default function DashboardNavbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { user, loading } = useUser();
  const { isLoggedIn } = useAuth();

  // Flatten all sidebar sections into a single array
  const allNavItems = SIDEBAR_SECTIONS.flatMap(section => section.items);

  return (
    <nav className={clsx(
      "sticky top-0 z-40 w-full",
      "border-b border-slate-200 dark:border-slate-700",
      "bg-white dark:bg-slate-900",
      "transition-colors duration-200"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className={clsx(
              "h-10 w-10 rounded-lg",
              "bg-gradient-to-br from-indigo-500 to-indigo-600",
              "text-white flex items-center justify-center",
              "font-bold text-sm"
            )}>
              ET
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-slate-900 dark:text-white text-sm">Expense Tracker</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Finance Manager</p>
            </div>
          </div>

          {/* Center: Navigation Items */}
          <div className="hidden lg:flex items-center gap-1">
            {allNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                    "text-sm font-medium",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: User & Actions */}
          <div className="flex items-center gap-3">
            {/* User Profile - Desktop */}
            {!loading && user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Image
                  alt="User Profile"
                  width={32}
                  height={32}
                  unoptimized
                  src={user.profile_picture || "/profilePicture.jpg"}
                  className="rounded-full border-2 border-indigo-500 object-cover w-8 h-8"
                />
                <div className="hidden md:block">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {user.firstname}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <ToggleTheme />

            {/* Logout Button */}
            {isLoggedIn && (
              <LogoutButton className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
