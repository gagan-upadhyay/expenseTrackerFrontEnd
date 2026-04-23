'use client';

import { useTransactions } from "@/src/context/transactionContext";
import { useUser } from "@/src/context/userContext";
import { useMemo, useEffect, useState } from "react";
import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import { formatCurrency } from "@/src/utils/currencyFormatter";
import { SavingsChart } from "@/src/components/ui/charts/lineChart";
import { ExpenseChart } from "@/src/components/ui/charts/charts";
import { IncomeChart } from "@/src/components/ui/charts/IncomeChart";
import { ExpenseTrendChart } from "@/src/components/ui/charts/ExpenseTrends";
import { CashflowChart } from "@/src/components/ui/charts/CashflowChart";
import { useFinancialInsights } from "@/src/Hooks/AnalyticsHooks/useFinancialInsights";
import { useAnomalies } from "@/src/Hooks/AnalyticsHooks/useAnomalies";
import { AnomalyAlerts } from "@/src/components/Analytics/AnomalyAlerts";
import { AIInsights } from "@/src/components/Analytics/AIInsights";
import InsightsPanel from "@/src/components/Analytics/InsightsPanel";
import { DrilldownPanel } from "@/src/components/Analytics/DrillDownPanel";
import { FinancialSummary } from "@/src/components/Analytics/FinancialSummary";



/* ---------------- COUNT UP ---------------- */
function CountUp({ value, baseCurrency }: { value: number, baseCurrency:string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <>{`${formatCurrency(count, baseCurrency)}`}</>;
}

export default function RevenueAnalyticsPage() {
  const { transactions } = useTransactions();
  const { user } = useUser();

  type DateRange = 'week' | 'month' | 'quarter' | 'year';

  // const [dateRange, setDateRange] = useState<DateRange>('month');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 86400000));
  const [endDate, setEndDate] = useState(new Date());

    /* ---------------- FILTER ---------------- */
  const filteredTransactions = useMemo(() => {
    return transactions?.filter(tx => {
      const d = new Date(tx.occurred_at);
      return d >= startDate && d <= endDate;
    }) || [];
  }, [transactions, startDate, endDate]);

  const insights = useFinancialInsights(filteredTransactions);
  const anomalies = useAnomalies(filteredTransactions);

  const baseCurrency = user?.base_currency;
  // const insights = useFinancialInsights(filtered)

const metrics = useMemo(() => {
  const income = filteredTransactions.filter(t => t.type === "credit");
  const expense = filteredTransactions.filter(t => t.type === "debit");

  const totalIncome = income.reduce((a, b) => a + Number(b.amount), 0);
  const totalExpenses = expense.reduce((a, b) => a + Number(b.amount), 0);

  return {
    totalIncome,
    totalExpenses,
    net: totalIncome - totalExpenses,
  };
}, [filteredTransactions]);

  return (
    <AuthGuard>
      <div className="min-h-screen px-6 pb-10 space-y-6 scrollbar-hid">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Revenue Intelligence
          </h1>
          <p className="text-xs opacity-40 tracking-widest uppercase">
            Financial Command Center
          </p>
        </div>

        {/* KPI ROW */}

        <FinancialSummary
          income={metrics.totalIncome}
          expenses={metrics.totalExpenses}
        />
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          
          <div className="glass glass-md glass-rounded glass-hover">
            <div className="flex justify-between mb-3">
              <span className="text-[11px] opacity-50 uppercase">Revenue</span>
              <ArrowUpIcon className="w-4 h-4 text-green-400" />
            </div>

            <div className="text-2xl font-bold">
               {<CountUp value={metrics.totalIncome} />}
            </div>
          </div>

          
          <div className="glass glass-md glass-rounded glass-hover">
            <div className="flex justify-between mb-3">
              <span className="text-[11px] opacity-50 uppercase">Expenses</span>
              <ArrowDownIcon className="w-4 h-4 text-red-400" />
            </div>

            <div className="text-2xl font-bold">
              <CountUp value={metrics.totalExpenses} />
            </div>
          </div>

          
          <div className="glass glass-md glass-rounded glass-hover">
            <div className="flex justify-between mb-3">
              <span className="text-[11px] opacity-50 uppercase">Net</span>
              <ArrowTrendingUpIcon className="w-4 h-4 text-indigo-400" />
            </div>

            <div className="text-2xl font-bold">
              <CountUp value={metrics.net} />
            </div>
          </div>
        </div> */}

        {/* ---------------- GRID SYSTEM ---------------- */}
        {/* Proper Industry Layout (NOT cluttered) */}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* LEFT MAIN (2 columns span) */}
          <div className="xl:col-span-2  space-y-6">

            <CashflowChart 
            // transactions={filteredTransactions}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIInsights insights={insights} />
              <InsightsPanel transactions={filteredTransactions}/>
              <AnomalyAlerts anomalies={anomalies} />
              

            </div>
            {/* FUTURE TREND MOCK (reuse savings style) */}

          </div>

          {/* RIGHT GRID (2x2 charts) */}
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpenseChart 
            // transactions={filteredTransactions}
            />
            <SavingsChart 
            // transactions={filteredTransactions}
            />
            
            <ExpenseTrendChart 
            // transactions={filteredTransactions}
            />
            <IncomeChart 
            // transactions={filteredTransactions}
            />
            
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="glass glass-lg glass-rounded">
          <h3 className="text-lg font-semibold mb-4">AI Financial Insights</h3>

          <div className="grid md:grid-cols-3 gap-6 text-sm">

            <div>
              <p className="opacity-50 mb-1">Burn Rate</p>
              <p className="text-xl font-bold">
                {(metrics.totalIncome / Math.max(metrics.totalExpenses, 1)).toFixed(2)}x
              </p>
            </div>

            <div>
              <p className="opacity-50 mb-1">Profit Margin</p>
              <p className="text-xl font-bold">
                {((metrics.net / Math.max(metrics.totalIncome, 1)) * 100).toFixed(1)}%
              </p>
            </div>

           <div>
              <p className="opacity-50 mb-1">Insight</p>
              <p className="opacity-70">
                {metrics.net > 0
                  ? "Strong positive cashflow. Consider investments."
                  : "Expenses are outpacing income. Monitor burn rate."}
              </p>
            </div>

          </div>
        </div>
        
      </div>
      <DrilldownPanel transactions={filteredTransactions}/>
    </AuthGuard>
  );
}