'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useTheme } from "@/src/context/themeContext";
import { SIDEBAR_SECTIONS } from "@/src/components/sidebar/sidebar.config";

export default function SideBarLinks({ expanded }: { expanded: boolean }) {
  const pathname = usePathname();
  const { theme } = useTheme();

  const isExpanded = expanded;

  return (
    <div className="flex flex-col gap-2 mt-6">
      {SIDEBAR_SECTIONS.flatMap((section) =>
        section.items.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-indigo-600/40 text-white"
                  : theme === "dark"
                  ? "text-slate-200 hover:text-white hover:bg-white/10"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-200",
                isExpanded ? "" : "justify-center"
              )}
              aria-label={link.name}
            >
              <span
                className={clsx(
                  "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all duration-300",
                  isActive ? "bg-indigo-400" : "bg-transparent"
                )}
              />

              <Icon className="w-5 h-5" />

              <span
                className={clsx(
                  "duration-200 whitespace-nowrap",
                  isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                )}
              >
                {link.name}
              </span>

              {!isExpanded && (
                <span className="pointer-events-none absolute left-full ml-2 hidden rounded-md bg-slate-950 px-2 py-1 text-xs text-white shadow-xl group-hover:block">
                  {link.name}
                </span>
              )}
            </Link>
          );
        })
      )}
    </div>
  );
}