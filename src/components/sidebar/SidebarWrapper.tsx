'use client';

import clsx from "clsx";
import { useState } from "react";
import { SIDEBAR_SECTIONS } from "./sidebar.config";
import SidebarSection from "./SidebarSection";
import UserProfile from "./userProfile";
import { useSidebar } from "@/src/context/sidebarContext";
import { useIsMobile } from "@/src/Hooks/useIsMobile";
import SideBarActions from "./sideBarActions";
import { Bars3Icon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { collapsed, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const expanded = isMobile ? open : !collapsed;

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className={clsx(
            "fixed top-4 left-4 z-50 rounded-lg p-2",
            "bg-slate-100 dark:bg-slate-800",
            "text-slate-900 dark:text-white",
            "hover:bg-slate-200 dark:hover:bg-slate-700",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500"
          )}
          aria-label="Open sidebar"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 transition-colors duration-200"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-screen flex flex-col",
          "border-r border-slate-200 dark:border-slate-700",
          "transition-all duration-300 ease-in-out",
          "bg-white dark:bg-slate-900",
          expanded ? "w-50" : "w-20",
          isMobile
            ? open
              ? "translate-x-0 shadow-xl"
              : "-translate-x-full"
            : "translate-x-0"
        )}
      >
        {/* Close Button - Mobile Only */}
        {isMobile && open && (
          <button
            onClick={() => setOpen(false)}
            className={clsx(
              "absolute top-4 right-4 z-60 rounded-lg p-2",
              "text-slate-900 dark:text-white",
              "hover:bg-slate-100 dark:hover:bg-slate-800",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500"
            )}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}

        {/* Desktop Toggle Button */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className={clsx(
              "absolute -right-3 top-6 z-60 rounded-full p-1.5",
              "bg-white dark:bg-slate-800",
              "border border-slate-200 dark:border-slate-700",
              "text-slate-600 dark:text-slate-400",
              "hover:bg-slate-50 dark:hover:bg-slate-700",
              "hover:text-slate-900 dark:hover:text-white",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500",
              "shadow-sm"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRightIcon className="w-4 h-4" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Sidebar Content */}
        <div className="flex flex-col overflow-y-auto h-full">
          {/* Header */}
          {/* <div className="flex md:flex-col transition-all duration-500 items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-700">
            <div className={clsx(
              "h-10 w-10 rounded-lg",
              "bg-gradient-to-br from-indigo-500 to-indigo-600",
              "text-white flex items-center justify-center",
              "font-bold text-sm",
              "flex-shrink-0"
            )}>
              ET
            </div>

            <div
              className={clsx(
                "text-center transition-all duration-300",
                expanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
              )}
            >
              <p className="font-bold text-slate-900 dark:text-white text-sm">Expense Tracker</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Smart Finance</p>
            </div>
          </div> */}

          {/* User Profile */}
          <UserProfile expanded={expanded} />

          {/* Navigation Sections */}
          <div className="flex-1 flex flex-col gap-2 py-4 overflow-y-auto no-scrollbar">
            {SIDEBAR_SECTIONS.map((section, idx) => (
              <SidebarSection
                key={idx}
                section={section}
                expanded={expanded}
              />
            ))}
          </div>

          {/* Actions - Bottom */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-3 ">
            <SideBarActions expanded={expanded} />
          </div>
        </div>
      </aside>
    </>
  );
}