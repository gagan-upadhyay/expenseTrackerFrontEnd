'use client';

import clsx from "clsx";
import { useState } from "react";
import { SIDEBAR_SECTIONS } from "./sidebar.config";
import SidebarSection from "./SidebarSection";
import UserProfile from "./userProfile";
import { useSidebar } from "@/src/context/sidebarContext";
import { useIsMobile } from "@/src/Hooks/useIsMobile";
import SideBarActions from "./sideBarActions";

export default function Sidebar() {
  const { collapsed } = useSidebar();
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);

  const expanded = isMobile ? open : !collapsed;

  return (
    <>
      {/* Mobile Toggle */}
      {isMobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 glass left-4 z-50 rounded-md bg-black text-white px-3 py-2"
        >
          ☰
        </button>
      )}

      {/* Overlay */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 left-0  z-50 h-screen flex flex-col border-r",
          "transition-all duration-300 ease-in-out",
          "bg-white dark:bg-slate-900",
          expanded ? "w-64" : "w-20 overflow-x-hidden",
          isMobile
            ? open
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        )}
      >
  

          <div className="flex flex-col  glass overflow-y-auto h-full">
  
            {/* TOP */}
            <div className="flex flex-col">
              {/* HEADER */}
              <div className="flex md:flex-col transition-all duration-500 items-center gap-2 p-4">
                <div className="h-10 transition-all duration-500 w-10 bg-indigo-500 text-white flex items-center justify-center rounded-lg font-bold">
                  ET
                </div>
                

                <div
                  className={clsx(
                    "text-center transition-all duration-300",
                    expanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                  )}
                >
                  <p className="font-bold text-white text-sm">Expense Tracker</p>
                </div>
              </div>

              <UserProfile />

              {SIDEBAR_SECTIONS.map((section, idx) => (
                <SidebarSection
                  key={idx}
                  section={section}
                  expanded={expanded}
                />
              ))}
            </div>

            {/* 🔥 BOTTOM (IMPORTANT FIX) */}
            <div className="p-2 border-t dark:border-white/10">
              <SideBarActions expanded={expanded} />
            </div>
          </div>
        
      </aside>
    </>
  );
}