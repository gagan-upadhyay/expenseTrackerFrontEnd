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
        "group relative flex items-center gap-3 px-3 py-2 rounded-xl",
        "transition-all duration-300 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500",
        isActive
          ? "bg-indigo-600/30 text-indigo-400"
          : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10",
        !expanded && "justify-center"
      )}
    >
      {/* Active Indicator */}
      <span
        className={clsx(
          "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all",
          isActive ? "bg-indigo-500" : "bg-transparent"
        )}
      />

      {/* <Icon className="w-5 h-5 shrink-0" /> 
      */}
      <Icon className="w-5 h-5" />

      {/* Label */}
      <span
        className={clsx(
          "whitespace-nowrap transition-all duration-300",
          expanded ? "opacity-100 ml-0" : "opacity-0 w-0 overflow-hidden"
        )}
      >
        {item.name}
      </span>

      {/* Tooltip */}
      {!expanded && (
        <span className="absolute left-full ml-2 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
          {item.name}
        </span>
      )}
    </Link>
  );
}