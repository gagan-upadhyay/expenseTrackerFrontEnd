'use client';

import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";
import { useAccounts } from "@/src/context/accountContext";
import { useTransactions } from "@/src/context/transactionContext";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/src/utils/currencyFormatter";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CreditCardIcon } from "@heroicons/react/24/outline";

type SavingsMetrics = {
    type: 'savings';
    balance: number;
    inflow: number;
    outflow: number;
    netGrowth: number;
};

type CreditMetrics = {
    type: 'credit';
    balance: number;
    creditUsed: number;
    creditLimit: number;
    percentUsed: number;
    availableCredit: number;
};

type AccountMetrics = SavingsMetrics | CreditMetrics | null;

export default function WalletPage(){
    const { accounts, loading } = useAccounts();
    const { transactions } = useTransactions();
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

    const selectedAccount = useMemo(() => {
        if (selectedAccountId && accounts) {
            return accounts.find(a => a.id === selectedAccountId) || accounts?.[0];
        }
        return accounts?.[0];
    }, [accounts, selectedAccountId]);

    // Calculate account-specific metrics
    const accountMetrics = useMemo(() => {
        if (!selectedAccount || !transactions) {
            return null;
        }

        const accountTxs = transactions.filter(tx => tx.account_id === selectedAccount.id);
        const incomeTxs = accountTxs.filter(tx => tx.type === 'credit');
        const expenseTxs = accountTxs.filter(tx => tx.type === 'debit');

        const totalIncome = incomeTxs.reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0);
        const totalExpense = expenseTxs.reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0);

        switch (selectedAccount.account_type) {
            case 'savings':
                return {
                    type: 'savings',
                    balance: parseFloat(selectedAccount.remaining_balance),
                    inflow: totalIncome,
                    outflow: totalExpense,
                    netGrowth: totalIncome - totalExpense,
                } as SavingsMetrics;
            
            case 'credit':
                // For credit: simulate credit used and remaining
                const creditUsed = totalExpense;
                const creditLimit = 100000; // Default or from account details
                const percentUsed = (creditUsed / creditLimit) * 100;
                return {
                    type: 'credit',
                    balance: parseFloat(selectedAccount.remaining_balance),
                    creditUsed: creditUsed,
                    creditLimit: creditLimit,
                    percentUsed: percentUsed,
                    availableCredit: creditLimit - creditUsed,
                } as CreditMetrics;
            
            default:
                return {
                    type: 'savings',
                    balance: parseFloat(selectedAccount.remaining_balance),
                    inflow: totalIncome,
                    outflow: totalExpense,
                    netGrowth: totalIncome - totalExpense,
                } as SavingsMetrics;
        }
    }, [selectedAccount, transactions]);

    if (loading) {
        return (
            <div className="w-full relative items-center justify-center">
                <AuthGuard>
                    <div className="animate-pulse space-y-4">
                        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    </div>
                </AuthGuard>
            </div>
        );
    }

    if (!selectedAccount) {
        return (
            <div className="w-full relative items-center justify-center">
                <AuthGuard>
                    <div className="text-center py-10">
                        <p className="text-slate-600 dark:text-slate-400">No accounts found</p>
                    </div>
                </AuthGuard>
            </div>
        );
    }

    return(
        <div className="w-full relative space-y-6 pb-10">
            <AuthGuard>
                {/* Header */}
                <div className="mt-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Wallet</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your accounts and view balances</p>
                </div>

                {/* Account Selector */}
                {accounts && accounts.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {accounts.map(account => (
                            <button
                                key={account.id}
                                onClick={() => setSelectedAccountId(account.id)}
                                className={clsx(
                                    "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                                    selectedAccount?.id === account.id
                                        ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                        : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                                )}
                            >
                                {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)}
                            </button>
                        ))}
                    </div>
                )}

                {/* Account Type: Savings */}
                {accountMetrics && accountMetrics.type === 'savings' && (
                    <div className="space-y-6">
                        {/* Main Balance Card */}
                        <div className={clsx(
                            "p-8 rounded-lg border",
                            "bg-white dark:bg-slate-800",
                            "border-slate-200 dark:border-slate-700"
                        )}>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Account Balance</p>
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                {formatCurrency(accountMetrics.balance, selectedAccount.currency_code)}
                            </h2>

                            {/* In/Out Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={clsx(
                                    "p-4 rounded-lg",
                                    "bg-green-50 dark:bg-green-900/20",
                                    "border border-green-200 dark:border-green-800"
                                )}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <ArrowTrendingUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Inflow</p>
                                    </div>
                                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                        +{formatCurrency(accountMetrics.inflow, selectedAccount.currency_code)}
                                    </p>
                                </div>

                                <div className={clsx(
                                    "p-4 rounded-lg",
                                    "bg-red-50 dark:bg-red-900/20",
                                    "border border-red-200 dark:border-red-800"
                                )}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <ArrowTrendingDownIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Outflow</p>
                                    </div>
                                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                                        -{formatCurrency(accountMetrics.outflow, selectedAccount.currency_code)}
                                    </p>
                                </div>

                                <div className={clsx(
                                    "p-4 rounded-lg",
                                    accountMetrics.netGrowth >= 0 
                                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                                        : "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                                )}>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Net Growth</p>
                                    <p className={clsx(
                                        "text-xl font-bold",
                                        accountMetrics.netGrowth >= 0
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-orange-600 dark:text-orange-400"
                                    )}>
                                        {accountMetrics.netGrowth >= 0 ? '+' : ''}{formatCurrency(accountMetrics.netGrowth, selectedAccount.currency_code)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Account Type: Credit */}
                {accountMetrics && accountMetrics.type === 'credit' && (
                    <div className="space-y-6">
                        {/* Credit Limit Card */}
                        <div className={clsx(
                            "p-8 rounded-lg border",
                            "bg-white dark:bg-slate-800",
                            "border-slate-200 dark:border-slate-700"
                        )}>
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCardIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Credit Account</p>
                            </div>

                            {/* Credit Usage Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold text-slate-900 dark:text-white">Credit Used</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                        {accountMetrics.percentUsed.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={clsx(
                                            "h-full transition-all duration-300",
                                            accountMetrics.percentUsed < 50 
                                                ? "bg-green-500 dark:bg-green-400"
                                                : accountMetrics.percentUsed < 80
                                                ? "bg-yellow-500 dark:bg-yellow-400"
                                                : "bg-red-500 dark:bg-red-400"
                                        )}
                                        style={{ width: `${accountMetrics.percentUsed}%` }}
                                    />
                                </div>
                            </div>

                            {/* Credit Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Credit Limit</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(accountMetrics.creditLimit, selectedAccount.currency_code)}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Used</p>
                                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                                        {formatCurrency(accountMetrics.creditUsed, selectedAccount.currency_code)}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Available</p>
                                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(accountMetrics.availableCredit, selectedAccount.currency_code)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Default View (fallback) */}
                <div className="grid gap-6">
                    <CardWrapper title='Wallet'/>
                    <CardWrapper title="Transactions"/>
                </div>
            </AuthGuard> 
        </div>
    )
}