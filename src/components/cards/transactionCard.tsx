'use client';

import { useTransactions } from "@/src/context/transactionContext";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import TransacationSkeleton from "../skeletons/transactionSkeleton";
import { usePathname } from "next/navigation";
import { GrTransaction } from "react-icons/gr";
// import { Button } from "../ui/buttons/buttons";
import { useTheme } from "@/src/context/themeContext";
import { convertToMMYY } from "@/src/utils/timeConverter";
import { Button } from "../ui/buttons/buttons";

interface TransactionCardProps {
  pageClass: string;
}

export default function TransactionCard({ pageClass }: TransactionCardProps) {
  const { transactions, errorMsg, loading } = useTransactions();
  const path = usePathname();
  const { theme } = useTheme();
  // const router = useRouter();

  const transactionPage = path.includes('transactions');
  const dashboardPage = path.includes('dashboard');

  if (loading) {
    return <TransacationSkeleton pageClass={pageClass} skeleton />;
  }

  if (!transactions || transactions.length === 0) {
    return <TransacationSkeleton skeleton={false} pageClass={pageClass} />;
  }

  return (
    <div
      className={clsx(
        "relative flex flex-col rounded-2xl p-6", // ✅ SAME AS WALLET
        "glass glass-hover smooth-theme",        // ✅ SAME DESIGN SYSTEM
        "overflow-hidden",
        pageClass,
        !dashboardPage && "mt-6"
      )}
    >
      {/* Glow (same as wallet/card) */}
      <div className="glow glow-indigo -top-10 -right-10"></div>
      <div className="glow glow-purple -bottom-10 -left-10 "></div>

      {/* Header */}
      <div
        className={clsx(
          "flex items-center justify-between mb-4 p-3 rounded-xl",
          theme === "dark" ? "bg-white/5" : "bg-black/5"
        )}
      >
        <div className={clsx("flex items-center gap-2", !transactionPage&&"w-full justify-center")}>
          {transactionPage && (
            <GrTransaction className="w-7 h-7 p-1.5 rounded-lg border" />
          )}

          <div>
            <h3 className={clsx("text-lg font-semibold" )}>Transactions</h3>
            {transactionPage && (
              <p className="hidden md:block text-xs opacity-70">
                Track and view all your transactions
              </p>
            )}
          </div>
        </div>

        {transactionPage && (
          <Button
          href="/transactions/add"
          className="relative z-10"
          >
            <span className="lg:hidden">+</span>
            <span className="hidden lg:inline">Add</span>
          </Button>
        )}
      </div>

      {/* List */}
      {!errorMsg && (
        <div className="flex flex-col gap-2">
          <ul className="divide-y divide-gray-500/20">
            {transactions.map((transaction, index) => (
              <li
                key={transaction.id || index}
                className="grid grid-cols-4 items-center gap-2 py-3 px-2 hover:bg-white/5 rounded-lg transition-all"
              >
                {/* Icon */}
                <div
                  className={clsx(
                    "flex items-center justify-center w-8 h-8 rounded-xl",
                    transaction.type === "credit" && "bg-green-400/20 text-green-500",
                    transaction.type === "debit" && "bg-red-400/20 text-red-500"
                  )}
                >
                  {transaction.type === "credit" ? (
                    <ArrowTrendingUpIcon className="w-5 h-5" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-5 h-5" />
                  )}
                </div>

                {/* Name */}
                <div className="relative group truncate text-sm">
                  {transaction.display_name}
                  <div className="absolute left-0 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-all bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    {transaction.display_name}
                  </div>
                </div>

                {/* Date */}
                <div className="text-xs text-center opacity-70">
                  {convertToMMYY(transaction.occurred_at)}
                </div>

                {/* Amount */}
                <div className="text-sm text-right font-medium">
                  {getCurrencySymbol(transaction.currency_code)}
                  {transaction.amount}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}