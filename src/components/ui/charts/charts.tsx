"use client";

import React, { useState, useMemo } from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import clsx from "clsx";
// import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/src/context/transactionContext";
import { useAccounts } from "@/src/context/accountContext";
import ExpenseChartSkeleton from "../../skeletons/chartSkeleton";
import { useDrilldown } from "@/src/Hooks/AnalyticsHooks/useDrillDown";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];

export function ExpenseChart(
  // { transactions }: { transactions: Transaction[] }

) {
  const { transactions, loading } = useTransactions();
  const { accounts } = useAccounts();
  const{setDrill} = useDrilldown();
  
  // State for filtering
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");

  // Logic to process chart data based on selected account
  const chartData = useMemo(() => {
    if (!transactions) return [];

    // 1. Filter by account and ensure it's a debit (expense)
    const filtered = transactions.filter(t => 
      (selectedAccountId === "all" || t.account_id === selectedAccountId) &&
      t.type === "debit"
    );

    // 2. Aggregate by category
    const categories: Record<string, number> = {};
    filtered.forEach(t => {
      const cat = t.category_code || "OTHERS";
      categories[cat] = (categories[cat] || 0) + Math.abs(Number(t.amount));
    });

    // 3. Format for Recharts
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions, selectedAccountId]);

  if (loading) return <ExpenseChartSkeleton />;

  return (
    <div className="relative flex flex-col rounded-2xl p-6 glass backdrop-blur-xl border border-white/10 h-full">
      <div className="glow glow-indigo -top-10 -right-10 pointer-events-none" />
      <div className="glow glow-purple -bottom-10 -left-10 pointer-events-none" />

      {/* Header with Dropdown */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 relative z-10">
        <h3 className="text-lg font-bold tracking-tight">Monthly Expenses</h3>
        
        <select 
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="glass px-3 py-1.5 rounded-xl text-xs outline-none border border-white/10 bg-transparent cursor-pointer hover:bg-white/5 transition-all"
        >
          <option value="all" className="text-black">All Accounts</option>
          {accounts?.map(acc => (
            <option key={acc.id} value={acc.id} className="text-black">
              {acc.account_type.toUpperCase()} ({acc.currency_code})
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[260px] flex justify-center items-center">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart syncId="analytics">
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={65}
                paddingAngle={5}
                stroke="none"
                onClick={(data) => {
                  setDrill("category", data.name);
                }}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 15, 15, 0.8)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "12px"
                }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs opacity-40 italic">No expenses found for this account</p>
        )}
      </div>

      {/* Custom Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto no-scrollbar">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-[10px] font-bold opacity-60 uppercase truncate">{item.name}</span>
            <span className="text-[10px] ml-auto opacity-40 font-mono">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
