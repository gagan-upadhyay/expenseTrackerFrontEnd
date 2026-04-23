"use client";

import React, { useState, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { useTransactions } from "@/src/context/transactionContext";
import { useAccounts } from "@/src/context/accountContext";
import { formatCurrency } from "@/src/utils/currencyFormatter";
import ExpenseTrendSkeleton from "../../skeletons/ExpenseTrendsSkeleton";
import { useDrilldown } from "@/src/Hooks/AnalyticsHooks/useDrillDown";
// import ExpenseTrendSkeleton from "../../skeletons/expenseTrendSkeleton";

export function ExpenseTrendChart(
  // { transactions }: { transactions: Transaction[] }
) {
  const { transactions,loading } = useTransactions();
  const { accounts } = useAccounts();
  const {setDrill} = useDrilldown();

  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");

  const chartData = useMemo(() => {
    if (!transactions) return [];

    const filtered = transactions.filter(t =>
      (selectedAccountId === "all" || t.account_id === selectedAccountId) &&
      t.type === "debit"
    );

    // Group by month-year
    const monthly: Record<string, number> = {};

    const sorted = [...filtered].sort(
      (a, b) =>
        new Date(a.occurred_at).getTime() -
        new Date(b.occurred_at).getTime()
    );

    sorted.forEach(t => {
      const date = new Date(t.occurred_at);

      const key = date.toLocaleString("default", {
        month: "short",
      });

      monthly[key] = (monthly[key] || 0) + Math.abs(Number(t.amount));
    });

    return Object.entries(monthly)
      .map(([month, value]) => ({ month, value }))
      .slice(-6); // last 6 months
  }, [transactions, selectedAccountId]);

  if (loading) return <ExpenseTrendSkeleton />;

  return (
    <div className="relative flex flex-col glass glass-md glass-rounded glass-hover h-full overflow-hidden">

      {/* Glow */}
      <div className="glow glow-indigo -top-10 -right-10 pointer-events-none" />
      <div className="glow glow-purple -bottom-10 -left-10 pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-sm font-bold">Expense Trend</h3>
          <p className="text-[10px] uppercase opacity-40 tracking-widest">
            Last 6 Months
          </p>
        </div>

        <select
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="glass px-3 py-1 rounded-xl text-[10px] font-bold uppercase border border-white/10 bg-transparent outline-none"
        >
          <option value="all" className="text-black">All</option>
          {accounts?.map(acc => (
            <option key={acc.id} value={acc.id} className="text-black">
              {acc.account_type.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              syncId="analytics"
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              {/* Gradient */}
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Grid */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />

              {/* X Axis */}
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 10,
                  fill: "rgba(255,255,255,0.4)",
                  fontWeight: "bold",
                }}
              />

              {/* Y Axis (IMPORTANT — SCALE ADDED) */}
              {/* <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                tick={{
                  fontSize: 10,
                  fill: "rgba(255,255,255,0.3)",
                }}
                axisLine={false}
                tickLine={false}
              /> */}
              <YAxis
                width={35} // ✅ removes reserved space
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                tick={{
                  fontSize: 10,
                  fill: "rgba(255,255,255,0.3)",
                }}
                axisLine={false}
                tickLine={false}
              />
              {/* Tooltip */}
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  background: "rgba(15,15,15,0.85)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#fff", fontWeight: "bold" }}
                cursor={{
                  stroke: "rgba(255,255,255,0.1)",
                  strokeWidth: 2,
                }}
              />

              {/* Area (soft fill) */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                fill="url(#expenseGradient)"
              />

              {/* Line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f43f5e"
                strokeWidth={3}
                onClick={() => {
                  // TODO: Implement drill-down functionality
                }}

                dot={{
                  r: 3,
                  fill: "#0f172a",
                  stroke: "#f43f5e",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#fff",
                }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs opacity-40 italic text-center mt-20">
            No expense data available
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between text-[9px] opacity-40">
        <span>Monthly Outflow</span>
        <span>Auto Aggregated</span>
      </div>
    </div>
  );
}