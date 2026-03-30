'use client';

import { useAccounts } from "@/src/context/accountContext";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import WalletSkeleton from "../skeletons/walletSkeleton";

interface WalletCardProps {
  parentClass: string;
}

export default function WalletCard({ parentClass }: WalletCardProps) {
  const [showSensitive, setShowSensitive] = useState(false);
  const { accounts, loading } = useAccounts();
  const path = usePathname();
  // const [ishalt, setIshalt] = useState<boolean>(true);


  const isWalletPage = useMemo(() => path.includes("wallet"), [path]);
  const account = accounts?.[0];

  const toggleVisibility = () => setShowSensitive(prev => !prev);

  const StatBadge = ({ type }: { type: "up" | "down" }) => {
    const isUp = type === "up";
    const value = isUp ? account?.total_income : account?.total_expense;

    return (
      <div
        className={clsx(
          "flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md",
          "border border-gray/80 dark:border-white/5",
          "transition-all duration-500 hover:scale-105"
        )}
      >
        <div
          className={clsx(
            "w-6 h-6 flex items-center justify-center rounded-lg",
            isUp
              ? "bg-green-400/20 text-green-600 dark:bg-green-500/20 dark:text-green-400"
              : "bg-red-400/20 text-red-600 dark:bg-red-500/20 dark:text-red-400"
          )}
        >
          {isUp ? <ArrowTrendingUpIcon /> : <ArrowTrendingDownIcon />}
        </div>

        <span className="text-sm font-medium">
          {showSensitive && value !== undefined ? value : "*****"}
        </span>
      </div>
    );
  };

  if (loading) {
    return <WalletSkeleton skeleton parentClass={parentClass} />;
  }

  if (!account) {
    return <WalletSkeleton skeleton={false} parentClass={parentClass} />;
  }

  return (
<div
  className={clsx(
    parentClass,
    "w-full",    
    isWalletPage ? "h-auto mb-3 mt-6" : "h-full"
  )}
>
  {/* 🔮 Glow Accent (reusable now) */}
  <div className="glow glow-indigo -top-10 -right-10"></div>
  <div className="glow glow-purple -bottom-10 -left-10"></div>

  {/* Title */}
  <h3 className="text-lg font-semibold text-center opacity-80">
    Wallet Balance
  </h3>

  {/* Balance */}
  <div className="mt-4 text-center">
    <h1
      className={clsx(
        "text-2xl lg:text-4xl font-bold tracking-wide transition-all duration-500",
        showSensitive ? "blur-0" : "blur-sm select-none"
      )}
    >
      {showSensitive
        ? `${getCurrencySymbol(account.currency_code)} ${account.remaining_balance}`
        : "••••••"}
    </h1>
  </div>

  {/* Stats */}
  <div className="flex justify-center gap-4 mt-6">
    <StatBadge type="up" />
    <StatBadge type="down" />
  </div>

  {/* Toggle */}
  <button
    onClick={toggleVisibility}
    className={clsx(
      "absolute bottom-4 right-4 p-2 rounded-full",
      "glass", // ✅ reuse glass here too
      "hover:scale-110 active:scale-95 transition-all duration-300"
    )}
  >
        {showSensitive ? (
          <EyeIcon className="w-4 h-4 lg:w-5 lg:h-5" />
        ) : (
          <EyeSlashIcon className="w-4 h-4 lg:w-5 lg:h-5" />
        )}
      </button>
    </div>
  );
}