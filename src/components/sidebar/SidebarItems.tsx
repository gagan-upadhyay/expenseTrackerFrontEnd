'use client';

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { SidebarItemType } from "./SidebarSection";

export default function SidebarItem({ item, expanded }: {item:SidebarItemType, expanded:boolean}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg",
        "transition-all duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900",
        isActive
          ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-semibold shadow-sm"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50",
        !expanded && "justify-center"
      )}
    >
      {/* Active Indicator Bar */}
      <span
        className={clsx(
          "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full transition-all duration-200",
          isActive ? "bg-indigo-600 dark:bg-indigo-400" : "bg-transparent"
        )}
      />

      {/* Icon */}
      <Icon className={clsx(
        "w-5 h-5 flex-shrink-0 transition-transform duration-200",
        isActive && "scale-110"
      )} />

      {/* Label */}
      <span
        className={clsx(
          "whitespace-nowrap transition-all duration-300 text-sm font-medium",
          expanded ? "opacity-100 ml-0" : "opacity-0 w-0 overflow-hidden"
        )}
      >
        {item.name}
      </span>

      {/* Tooltip for Collapsed State */}
      {!expanded && (
        <span className="absolute left-full ml-2 hidden rounded-lg bg-slate-900 dark:bg-slate-700 px-2 py-1 text-xs text-white whitespace-nowrap shadow-lg z-50 group-hover:block">
          {item.name}
          <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-r-4 border-r-slate-900 dark:border-r-slate-700 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
        </span>
      )}
    </Link>
  );
}