'use client';

import { useAccounts } from "@/src/context/accountContext";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import AccountDetailsSkeleton from "@/src/components/skeletons/accountDetailsSkeleton";

interface Props {
  parentClass: string;
}

export default function AccountDetailsCard({ parentClass }: Props) {
  const { accounts, loading } = useAccounts();
  const router = useRouter();

  if (loading) {
    return <AccountDetailsSkeleton parentClass={parentClass} />;
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className={clsx(parentClass, "w-full mt-6 relative")}> 
        <div className="glass p-6 rounded-2xl">
          <p className="text-center opacity-70">No Account Found</p>
          <button
            onClick={() => router.push("/account/add")}
            className="mt-3 glass-hover w-full py-2 rounded-xl text-sm"
          >
            Add Account
          </button>
        </div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.remaining_balance), 0);
  const totalIncome = accounts.reduce((sum, acc) => sum + Number(acc.total_income), 0);
  const totalExpense = accounts.reduce((sum, acc) => sum + Number(acc.total_expense), 0);

  return (
    <div className={clsx(parentClass, "w-full mt-6 relative")}> 
      {/* Glow */}
      <div className="glow glow-indigo -top-10 -right-10"></div>
      <div className="glow glow-purple -bottom-10 -left-10"></div>

      {/* Header and totals */}
      <div className="glass p-4 rounded-2xl mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-lg md:text-xl font-semibold">My Accounts</h3>
            <p className="text-xs opacity-70">{accounts.length} account{accounts.length > 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-semibold">Total Balance</span>
            <span>{getCurrencySymbol(accounts[0]?.currency_code)} {totalBalance.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
          <div className="glass px-2 py-1 rounded-md">
            <p className="opacity-70">Total Income</p>
            <p className="font-medium">{getCurrencySymbol(accounts[0]?.currency_code)} {totalIncome.toFixed(2)}</p>
          </div>
          <div className="glass px-2 py-1 rounded-md">
            <p className="opacity-70">Total Expense</p>
            <p className="font-medium">{getCurrencySymbol(accounts[0]?.currency_code)} {totalExpense.toFixed(2)}</p>
          </div>
          <div className="glass px-2 py-1 rounded-md">
            <p className="opacity-70">Avg Remaining</p>
            <p className="font-medium">{getCurrencySymbol(accounts[0]?.currency_code)} {(totalBalance / accounts.length).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Per-account cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="glass p-4 rounded-2xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">{acc.account_name}</h4>
              <span className="text-xs uppercase opacity-70">{acc.currency_code}</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {getCurrencySymbol(acc.currency_code)} {acc.remaining_balance}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="glass px-2 py-1 rounded-md text-green-700">Income: {getCurrencySymbol(acc.currency_code)} {acc.total_income}</span>
              <span className="glass px-2 py-1 rounded-md text-red-700">Expense: {getCurrencySymbol(acc.currency_code)} {acc.total_expense}</span>
            </div>
            <p className="mt-2 text-xs opacity-70">Opening: {getCurrencySymbol(acc.currency_code)} {acc.opening_balance}</p>
          </div>
        ))}
      </div>

      {/* CTA: Add Transaction */}
      <button
        onClick={() => router.push("/account/add")}
        className="glass-hover mt-6 w-full py-2 rounded-xl flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-4 h-4" />
        Add Account
      </button>
    </div>
  );
}