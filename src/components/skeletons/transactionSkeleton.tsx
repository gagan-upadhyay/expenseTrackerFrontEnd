'use client';

import { useTheme } from "@/src/context/themeContext";
import clsx from "clsx";
import { RedirectingButton } from "../ui/buttons/redirectingButton";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface TransactionCardSkeletonProps {
  pageClass: string;
  skeleton: boolean;
}

export default function TransacationSkeleton({
  pageClass,
  skeleton,
}: TransactionCardSkeletonProps) {
  const { theme } = useTheme();
  const path = usePathname();

  const transactionPage = useMemo(() => path.includes("transactions"), [path]);
  const dashboardPage = useMemo(() => path.includes("dashboard"), [path]);

  return (
    <div
      className={clsx(
        "relative flex flex-col rounded-2xl p-6", // ✅ match real card
        "glass glass-hover smooth-theme",
        "overflow-hidden",
        pageClass,
        !dashboardPage && "mt-6"
      )}
    >
      {/* Glow (same as real component) */}
      <div className="glow glow-indigo -top-10 -right-10"></div>
      <div className="glow glow-purple -bottom-10 -left-10"></div>

      {/* Empty state */}
      {!skeleton && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <RedirectingButton
            theme={theme}
            target={"/transactions/add-transactions"}
            title={"transactions"}
          />
        </div>
      )}

      {/* Header Skeleton */}
      <div
        className={clsx(
          "flex items-center justify-between mb-4 p-3 rounded-xl",
          theme === "dark" ? "bg-white/5" : "bg-black/5"
        )}
      >
        <div className="flex items-center gap-2">
          {transactionPage && (
            <div className="w-7 h-7 rounded-lg skeleton" />
          )}

          <div className="flex flex-col gap-1">
            <div className="h-4 w-28 rounded-md skeleton" />
            {transactionPage && (
              <div className="hidden md:block h-3 w-40 rounded-md skeleton" />
            )}
          </div>
        </div>

        {transactionPage && (
          <div className="h-8 w-20 rounded-md skeleton" />
        )}
      </div>

      {/* List Skeleton */}
      <div className="flex flex-col gap-2">
        <ul className="divide-y divide-gray-500/20">
          {Array.from({ length: 6 }).map((_, index) => (
            <li
              key={index}
              className="grid grid-cols-4 items-center gap-2 py-3 px-2"
            >
              {/* Icon */}
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-xl skeleton" />
              </div>

              {/* Name */}
              <div className="h-4 w-24 rounded-md skeleton" />

              {/* Date */}
              <div className="h-3 w-16 mx-auto rounded-md skeleton" />

              {/* Amount */}
              <div className="h-4 w-16 ml-auto rounded-md skeleton" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}