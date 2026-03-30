'use client';

import { FaCcVisa } from "react-icons/fa";
import CreditCard from "./creditCards";
import { lusitana } from "@/src/assets/fonts/fonts";
import clsx from "clsx";
import WalletCard from "./walletCard";
import TransactionCard from "./transactionCard";
import { ExpenseChart } from "../ui/charts/charts";
import { SavingsChart } from "../ui/charts/lineChart";
import AddAccountCard from "./addAccountCard";
import AddTransactionCard from "./AddTransaction";
import AccountDetailsCard from "./AccountDetailsCard";

interface CardProps {
  title: string;
}

export default function CardWrapper({ title }: CardProps) {
  const fontClass = lusitana.className;

  const parentClass = clsx(
    // 🌞 Light (default via CSS variables)
    "bg-[var(--color-primary)] text-[var(--color-text)] border-[var(--color-border)]",

    // 🌙 Dark override (only where needed)
    "dark:bg-gradient-to-r dark:from-gray-300 dark:to-gray-700",

    // Common styles
    "border rounded-lg p-4 shadow-md transition-all duration-500",
    //glass theme
    "glass glass-hover  smooth-theme relative flex flex-col rounded-2xl p-6 overflow-hidden",
    fontClass
  );

  return (
    <>
      {title === 'Card Details' ? (
        <CreditCard parentClass={parentClass} />
      ) : title === 'Wallet' ? (
        <WalletCard parentClass={parentClass} />
      ) : title === 'Transactions' ? (
        <TransactionCard pageClass={parentClass} />
      ) : title === 'Monthly Spent' ? (
        <ExpenseChart />
      ) : title === 'Savings' ? (
        <SavingsChart />
      ) : title==='add account'?(
        <AddAccountCard parentClass={parentClass}/>
      ) : title==='add transaction'?(
        <AddTransactionCard/>
      ): title === 'account details'?(
        <AccountDetailsCard parentClass={parentClass}/>
      ):
      (
        <div className={parentClass}>
          <h3 className="text-lg text-center font-semibold">{title}</h3>
          <FaCcVisa size={60} />
        </div>
      )}
    </>
  );
}