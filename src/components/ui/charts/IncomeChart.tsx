"use client";

import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTransactions } from "@/src/context/transactionContext";
import { useAccounts } from "@/src/context/accountContext";
import { formatCurrency } from "@/src/utils/currencyFormatter";
import IncomeChartSkeleton from "../../skeletons/IncomeChartSkeleton";
import { useDrilldown } from "@/src/Hooks/AnalyticsHooks/useDrillDown";
// import { Transaction } from "@/src/utils/definitions";


const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#22D3EE"];

// type transa

export function IncomeChart(
  // { transactions }: { transactions: Transaction[] }
) {
  const { transactions, loading } = useTransactions();
  const { accounts } = useAccounts();
  const {setDrill} = useDrilldown();

  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");

  const chartData = useMemo(() => {
    if (!transactions) return [];

    const filtered = transactions.filter(t =>
      (selectedAccountId === "all" || t.account_id === selectedAccountId) &&
      t.type === "credit"
    );

    const categories: Record<string, number> = {};

    filtered.forEach(t => {
      const cat = t.category_code || "OTHERS";
      categories[cat] = (categories[cat] || 0) + Number(t.amount);
    });

    const total = Object.values(categories).reduce((a, b) => a + b, 0);

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
      percentage: total ? ((value / total) * 100).toFixed(1) : 0,
    }));
  }, [transactions, selectedAccountId]);

  if (loading) return <IncomeChartSkeleton />;

  return (
    <div className="relative flex flex-col glass glass-md glass-rounded glass-hover h-full overflow-hidden">

      {/* Glow */}
      <div className="glow glow-indigo -top-10 -right-10 pointer-events-none" />
      <div className="glow glow-purple -bottom-10 -left-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-bold tracking-wide opacity-80">
          Income Sources
        </h3>

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
      <div className="flex-1 min-h-[260px] flex items-center justify-center">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart syncId="analytics">
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                stroke="none"
                onClick={(data) => {
                  setDrill("category", data.name);
                }}
                
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

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
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs opacity-40 italic">
            No income data available
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto scrollbar-hide">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />

            <span className="text-[10px] uppercase font-bold opacity-60 truncate">
              {item.name}
            </span>

            <span className="text-[10px] ml-auto opacity-40 font-mono">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}