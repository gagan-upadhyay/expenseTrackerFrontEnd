'use client';

import { useTransactions } from "@/src/context/transactionContext";
import { useAccounts } from "@/src/context/accountContext";
import { useUser } from "@/src/context/userContext";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/src/utils/currencyFormatter";
import { ArrowUpIcon, ArrowDownIcon, ArrowTrendingUpIcon, CalendarIcon } from "@heroicons/react/24/outline";

type DateRange = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export default function RevenueAnalyticsPage() {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const { user } = useUser();
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Filter transactions by date range and type
  const filteredTransactions = useMemo(() => {
    return transactions?.filter(tx => {
      const txDate = new Date(tx.occurred_at);
      return txDate >= startDate && txDate <= endDate;
    }) || [];
  }, [transactions, startDate, endDate]);

  // Calculate revenue metrics
  const metrics = useMemo(() => {
    const incomeTxs = filteredTransactions.filter(tx => tx.type === 'credit');
    const expenseTxs = filteredTransactions.filter(tx => tx.type === 'debit');

    const totalIncome = incomeTxs.reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0);
    const totalExpenses = expenseTxs.reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0);
    const netIncome = totalIncome - totalExpenses;
    const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const avgRevenuePerDay = totalIncome / daysInPeriod;

    // Income source breakdown
    const incomeByCategory = {} as Record<string, number>;
    incomeTxs.forEach(tx => {
      const category = tx.category_code || 'Other';
      incomeByCategory[category] = (incomeByCategory[category] || 0) + parseFloat(tx.amount || '0');
    });

    const topIncomeSource = Object.entries(incomeByCategory).sort(([,a], [,b]) => b - a)[0];

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      avgRevenuePerDay,
      incomeTransactionCount: incomeTxs.length,
      expenseTransactionCount: expenseTxs.length,
      topIncomeSource: topIncomeSource ? { category: topIncomeSource[0], amount: topIncomeSource[1] } : null,
      incomeByCategory,
    };
  }, [filteredTransactions, startDate, endDate]);

  // Recurring vs one-time
  const recurringAnalysis = useMemo(() => {
    const incomeByDesc = {} as Record<string, number[]>;
    filteredTransactions.filter(tx => tx.type === 'credit').forEach(tx => {
      const desc = tx.description || 'Unknown';
      if (!incomeByDesc[desc]) incomeByDesc[desc] = [];
      incomeByDesc[desc].push(parseFloat(tx.amount));
    });

    const recurring = Object.entries(incomeByDesc)
      .filter(([, amounts]) => amounts.length > 1)
      .reduce((sum, [, amounts]) => sum + amounts.reduce((a, b) => a + b, 0), 0);

    return {
      recurring,
      oneTime: metrics.totalIncome - recurring,
    };
  }, [filteredTransactions, metrics.totalIncome]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Revenue Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Analyze your income and spending patterns</p>
      </div>

      {/* Date Range Selector */}
      <div className="flex flex-wrap gap-2">
        {(['week', 'month', 'quarter', 'year'] as DateRange[]).map(range => (
          <button
            key={range}
            onClick={() => {
              setDateRange(range);
              const now = new Date();
              let start = new Date();
              switch (range) {
                case 'week': start.setDate(now.getDate() - 7); break;
                case 'month': start.setDate(now.getDate() - 30); break;
                case 'quarter': start.setMonth(now.getMonth() - 3); break;
                case 'year': start.setFullYear(now.getFullYear() - 1); break;
              }
              setStartDate(start);
              setEndDate(now);
            }}
            className={clsx(
              "px-4 py-2 rounded-lg font-medium transition-all duration-200",
              dateRange === range
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
            )}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* High-Level Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className={clsx(
          "p-6 rounded-lg border transition-all duration-200",
          "bg-white dark:bg-slate-800",
          "border-slate-200 dark:border-slate-700",
          "hover:shadow-lg dark:hover:shadow-xl"
        )}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</p>
            <ArrowUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(metrics.totalIncome, 'USD')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {metrics.incomeTransactionCount} transactions
          </p>
        </div>

        {/* Total Expenses */}
        <div className={clsx(
          "p-6 rounded-lg border transition-all duration-200",
          "bg-white dark:bg-slate-800",
          "border-slate-200 dark:border-slate-700",
          "hover:shadow-lg dark:hover:shadow-xl"
        )}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Expenses</p>
            <ArrowDownIcon className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(metrics.totalExpenses, 'USD')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {metrics.expenseTransactionCount} transactions
          </p>
        </div>

        {/* Net Income */}
        <div className={clsx(
          "p-6 rounded-lg border transition-all duration-200",
          "bg-white dark:bg-slate-800",
          "border-slate-200 dark:border-slate-700",
          "hover:shadow-lg dark:hover:shadow-xl"
        )}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Net Income</p>
            <ArrowTrendingUpIcon className={clsx("w-5 h-5", metrics.netIncome >= 0 ? "text-green-500" : "text-red-500")} />
          </div>
          <p className={clsx(
            "text-2xl font-bold",
            metrics.netIncome >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {formatCurrency(metrics.netIncome, 'USD')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {((metrics.netIncome / metrics.totalIncome) * 100).toFixed(1)}% of income
          </p>
        </div>

        {/* Avg Revenue Per Day */}
        <div className={clsx(
          "p-6 rounded-lg border transition-all duration-200",
          "bg-white dark:bg-slate-800",
          "border-slate-200 dark:border-slate-700",
          "hover:shadow-lg dark:hover:shadow-xl"
        )}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Per Day</p>
            <CalendarIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(metrics.avgRevenuePerDay, 'USD')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Daily average
          </p>
        </div>
      </div>

      {/* Diversification & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Source Breakdown */}
        <div className={clsx(
          "p-6 rounded-lg border",
          "bg-white dark:bg-slate-800",
          "border-slate-200 dark:border-slate-700"
        )}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Income by Category</h3>
          <div className="space-y-3">
            {Object.entries(metrics.incomeByCategory).map(([category, amount]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{category}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(amount, 'USD')}</p>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-300"
                    style={{ width: `${(amount / metrics.totalIncome) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {((amount / metrics.totalIncome) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring vs One-Time */}
        <div className={clsx(
          "p-6 rounded-lg border",
          "bg-white dark:bg-slate-800",
          "border-slate-200 dark:border-slate-700"
        )}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Revenue Type</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Recurring</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(recurringAnalysis.recurring, 'USD')}</p>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 dark:bg-green-400 transition-all duration-300"
                  style={{ width: `${(recurringAnalysis.recurring / metrics.totalIncome) * 100 || 0}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {((recurringAnalysis.recurring / metrics.totalIncome) * 100 || 0).toFixed(1)}% guaranteed
              </p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">One-Time</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(recurringAnalysis.oneTime, 'USD')}</p>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 dark:bg-orange-400 transition-all duration-300"
                  style={{ width: `${(recurringAnalysis.oneTime / metrics.totalIncome) * 100 || 0}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {((recurringAnalysis.oneTime / metrics.totalIncome) * 100 || 0).toFixed(1)}% variable
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Analytics */}
      <div className={clsx(
        "p-6 rounded-lg border",
        "bg-white dark:bg-slate-800",
        "border-slate-200 dark:border-slate-700"
      )}>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Financial Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Burn Rate Coverage</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {metrics.totalExpenses > 0 ? (metrics.totalIncome / metrics.totalExpenses).toFixed(2) : '∞'}x
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Revenue covers {Math.floor((metrics.totalIncome / Math.max(metrics.totalExpenses, 1)) * 30)} days of expenses
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Profit Margin</p>
            <p className={clsx(
              "text-2xl font-bold",
              metrics.netIncome >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {((metrics.netIncome / Math.max(metrics.totalIncome, 1)) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Net profit percentage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
