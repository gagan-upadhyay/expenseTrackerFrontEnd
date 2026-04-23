// 'use client';

// import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
// import { useAccounts } from "@/src/context/accountContext";
// import { useTransactions } from "@/src/context/transactionContext";
// import { useMemo, useState } from "react";
// import clsx from "clsx";
// import {
//   ArrowTrendingUpIcon,
//   ArrowTrendingDownIcon,
//   CreditCardIcon,
// } from "@heroicons/react/24/outline";
// import { formatCurrency } from "@/src/utils/currencyFormatter";
// // import AddTransactionCard from "@/src/components/cards/AddTransaction";
// import TransactionCard from "@/src/components/cards/transactionCard";
// // import TransactionCard from "@/src/components/transactions/TransactionCard";

// type SavingsMetrics = {
//   type: 'savings';
//   balance: number;
//   inflow: number;
//   outflow: number;
//   netGrowth: number;
// };

// type CreditMetrics = {
//   type: 'credit';
//   balance: number;
//   creditUsed: number;
//   creditLimit: number;
//   percentUsed: number;
//   availableCredit: number;
// };

// type AccountMetrics = SavingsMetrics | CreditMetrics | null;

// export default function WalletPage() {
//   const { accounts, loading } = useAccounts();
//   const { transactions } = useTransactions();

//   const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

//   /* ---------------- SELECTED ACCOUNT ---------------- */
//   const selectedAccount = useMemo(() => {
//     if (selectedAccountId && accounts) {
//       return accounts.find(a => a.id === selectedAccountId) || accounts?.[0];
//     }
//     return accounts?.[0];
//   }, [accounts, selectedAccountId]);

//   /* ---------------- FILTERED TRANSACTIONS ---------------- */
//   const filteredTransactions = useMemo(() => {
//     if (!transactions || !selectedAccount) return [];
//     return transactions.filter(tx => tx.account_id === selectedAccount.id);
//   }, [transactions, selectedAccount]);

//   /* ---------------- METRICS ---------------- */
//   const accountMetrics = useMemo((): AccountMetrics => {
//     if (!selectedAccount || !transactions) return null;

//     const accountTxs = transactions.filter(tx => tx.account_id === selectedAccount.id);

//     const incomeTxs = accountTxs.filter(tx => tx.type === 'credit');
//     const expenseTxs = accountTxs.filter(tx => tx.type === 'debit');

//     const totalIncome = incomeTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);
//     const totalExpense = expenseTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);

//     if (selectedAccount.account_type === 'credit') {
//       const creditUsed = totalExpense;
//       const creditLimit = 100000;

//       return {
//         type: 'credit',
//         balance: Number(selectedAccount.remaining_balance),
//         creditUsed,
//         creditLimit,
//         percentUsed: (creditUsed / creditLimit) * 100,
//         availableCredit: creditLimit - creditUsed,
//       };
//     }

//     return {
//       type: 'savings',
//       balance: Number(selectedAccount.remaining_balance),
//       inflow: totalIncome,
//       outflow: totalExpense,
//       netGrowth: totalIncome - totalExpense,
//     };
//   }, [selectedAccount, transactions]);

//   if (loading || !selectedAccount) return null;

//   return (
//     <AuthGuard>
//       <div className="h-screen overflow-y-auto scrollbar-hide px-6 pb-10 space-y-6">

//         {/* ---------------- HEADER ---------------- */}
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">
//             Wallet Overview
//           </h1>
//           <p className="text-xs opacity-40 tracking-widest uppercase">
//             Account Intelligence
//           </p>
//         </div>

//         {/* ---------------- ACCOUNT SELECTOR ---------------- */}
//         {accounts && accounts.length > 1 && (
//           <div className="flex flex-wrap gap-2">
//             {accounts.map(account => (
//               <button
//                 key={account.id}
//                 onClick={() => setSelectedAccountId(account.id)}
//                 className={clsx(
//                   "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
//                   selectedAccount.id === account.id
//                     ? "glass bg-indigo-500/20 border border-indigo-400/30"
//                     : "glass hover:bg-white/10 border border-white/10"
//                 )}
//               >
//                 {account.account_type}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* ---------------- WALLET SUMMARY (GLASS) ---------------- */}
//         {accountMetrics && accountMetrics.type === "savings" && (
//           <div className="glass rounded-2xl p-6 border border-white/10">

//             <p className="text-[10px] uppercase opacity-40 mb-2">
//               Account Balance
//             </p>

//             <h2 className="text-3xl font-bold mb-6">
//               {formatCurrency(accountMetrics.balance, selectedAccount.currency_code)}
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//               {/* INFLOW */}
//               <div className="glass p-4 rounded-xl">
//                 <div className="flex items-center gap-2 mb-2">
//                   <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
//                   <span className="text-xs opacity-50">Inflow</span>
//                 </div>
//                 <p className="text-lg font-bold text-green-400">
//                   +{formatCurrency(accountMetrics.inflow, selectedAccount.currency_code)}
//                 </p>
//               </div>

//               {/* OUTFLOW */}
//               <div className="glass p-4 rounded-xl">
//                 <div className="flex items-center gap-2 mb-2">
//                   <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
//                   <span className="text-xs opacity-50">Outflow</span>
//                 </div>
//                 <p className="text-lg font-bold text-red-400">
//                   -{formatCurrency(accountMetrics.outflow, selectedAccount.currency_code)}
//                 </p>
//               </div>

//               {/* NET */}
//               <div className="glass p-4 rounded-xl">
//                 <p className="text-xs opacity-50 mb-2">Net Growth</p>
//                 <p className={clsx(
//                   "text-lg font-bold",
//                   accountMetrics.netGrowth >= 0 ? "text-indigo-400" : "text-orange-400"
//                 )}>
//                   {formatCurrency(accountMetrics.netGrowth, selectedAccount.currency_code)}
//                 </p>
//               </div>

//             </div>
//           </div>
//         )}

//         {/* ---------------- CREDIT VIEW ---------------- */}
//         {accountMetrics && accountMetrics.type === "credit" && (
//           <div className="glass rounded-2xl p-6 border border-white/10">

//             <div className="flex items-center gap-2 mb-4">
//               <CreditCardIcon className="w-5 h-5 text-indigo-400" />
//               <span className="text-sm font-bold">Credit Overview</span>
//             </div>

//             <div className="mb-4">
//               <div className="flex justify-between text-xs opacity-60 mb-1">
//                 <span>Usage</span>
//                 <span>{accountMetrics.percentUsed.toFixed(1)}%</span>
//               </div>

//               <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-indigo-400"
//                   style={{ width: `${accountMetrics.percentUsed}%` }}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4 text-sm">
//               <div>
//                 <p className="opacity-40">Limit</p>
//                 <p className="font-bold">
//                   {formatCurrency(accountMetrics.creditLimit, selectedAccount.currency_code)}
//                 </p>
//               </div>

//               <div>
//                 <p className="opacity-40">Used</p>
//                 <p className="text-red-400 font-bold">
//                   {formatCurrency(accountMetrics.creditUsed, selectedAccount.currency_code)}
//                 </p>
//               </div>

//               <div>
//                 <p className="opacity-40">Available</p>
//                 <p className="text-green-400 font-bold">
//                   {formatCurrency(accountMetrics.availableCredit, selectedAccount.currency_code)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ---------------- TRANSACTIONS ---------------- */}
//         <div className="h-[500px]">
//           <TransactionCard
//             pageClass="h-full"
//             transactions={filteredTransactions}   // 🔥 IMPORTANT
//           />
//         </div>

//       </div>
//     </AuthGuard>
//   );
// }

'use client';

import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import { useAccounts } from "@/src/context/accountContext";
import { useTransactions } from "@/src/context/transactionContext";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { formatCurrency } from "@/src/utils/currencyFormatter";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline";
import TransactionCard from "@/src/components/cards/transactionCard";

export default function WalletPage() {
  const { accounts, loading } = useAccounts();
  const { transactions } = useTransactions();

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const selectedAccount = useMemo(() => {
    if (!accounts) return null;
    return accounts.find(a => a.id === selectedAccountId) || accounts[0];
  }, [accounts, selectedAccountId]);

  const metrics = useMemo(() => {
    if (!selectedAccount || !transactions) return null;

    const txs = transactions.filter(t => t.account_id === selectedAccount.id);

    const income = txs
      .filter(t => t.type === "credit")
      .reduce((a, b) => a + Number(b.amount), 0);

    const expense = txs
      .filter(t => t.type === "debit")
      .reduce((a, b) => a + Number(b.amount), 0);

    return {
      balance: Number(selectedAccount.remaining_balance),
      income,
      expense,
      net: income - expense,
    };
  }, [selectedAccount, transactions]);

  if (loading || !selectedAccount || !metrics) return null;

  return (
    <AuthGuard>
      <div className="p-6 space-y-6">

        {/* 🔥 MAIN GLASS CONTAINER */}
        <div className="relative rounded-[2rem] p-8 glass backdrop-blur-xl border border-white/10 overflow-hidden">

          {/* GLOW */}
          <div className="glow glow-indigo -top-20 -right-20 pointer-events-none" />
          <div className="glow glow-purple -bottom-20 -left-20 pointer-events-none" />

          {/* HEADER ROW */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            {/* Account Selector */}
            <div className="flex gap-2 flex-wrap">
              {accounts?.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => setSelectedAccountId(acc.id)}
                  className={clsx(
                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    selectedAccount.id === acc.id
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  {acc.account_type}
                </button>
              ))}
            </div>

            {/* Account Type Badge */}
            <div className="flex items-center gap-2 text-xs opacity-60">
              <CreditCardIcon className="w-4 h-4" />
              {selectedAccount.account_type.toUpperCase()}
            </div>
          </div>

          {/* BALANCE */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest opacity-40 mb-2">
              Total Balance
            </p>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {formatCurrency(metrics.balance, selectedAccount.currency_code)}
            </h1>
          </div>

          {/* METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* INFLOW */}
            <div className="glass glass-sm rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-green-400">
                <ArrowTrendingUpIcon className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Inflow</span>
              </div>
              <p className="text-lg font-bold">
                +{formatCurrency(metrics.income, selectedAccount.currency_code)}
              </p>
            </div>

            {/* OUTFLOW */}
            <div className="glass glass-sm rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-red-400">
                <ArrowTrendingDownIcon className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Outflow</span>
              </div>
              <p className="text-lg font-bold">
                -{formatCurrency(metrics.expense, selectedAccount.currency_code)}
              </p>
            </div>

            {/* NET */}
            <div className="glass glass-sm rounded-xl p-4 flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wider opacity-50">
                Net
              </div>
              <p
                className={clsx(
                  "text-lg font-bold",
                  metrics.net >= 0 ? "text-green-400" : "text-red-400"
                )}
              >
                {metrics.net >= 0 ? "+" : ""}
                {formatCurrency(metrics.net, selectedAccount.currency_code)}
              </p>
            </div>

          </div>
          
        </div>

         <div className="h-[500px]">
         <TransactionCard
            pageClass="h-full"
            // transactions={filteredTransactions}   // 🔥 IMPORTANT
          />
        </div>

      </div>
    </AuthGuard>
  );
}