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
} from "recharts";
import { useAccounts } from "@/src/context/accountContext";
import LineChartSkeleton from "../../skeletons/lineChartSkeleton";
import { useDrilldown } from "@/src/Hooks/AnalyticsHooks/useDrillDown";
import { useAnomalies } from "@/src/Hooks/AnalyticsHooks/useAnomalies";
import { Transaction } from "@/src/utils/definitions";
import { Area } from "recharts";
import { useTransactions } from "@/src/context/transactionContext";


export function SavingsChart() {
  const { accounts, loading: accountsLoading } = useAccounts();
  const {transactions} = useTransactions();
  
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
  const {setDrill} = useDrilldown();
  const anomalies = useAnomalies(transactions || []);
//   const anomalyMonths = new Set(
//   anomalies.map(a =>
//     new Date(a.occurred_at).toLocaleString("default", { month: "short" })
//   )
// );
const anomalyMonths = new Set(
  anomalies.map(a => {
    const d = new Date(a.occurred_at);
    return `${d.getFullYear()}-${d.getMonth()}`;
  })
);
  // const chartData = useMemo(() => {
  //   if (!transactions) return [];

  //   // 1. Filter transactions by account
  //   const filtered = transactions.filter(t => 
  //     selectedAccountId === "all" || t.account_id === selectedAccountId
  //   );

  //   // 2. Group by month and calculate net change (Credit - Debit)
  //   const monthlyData: Record<string, number> = {};
    
  //   // Sort transactions by date first
  //   const sorted = [...filtered].sort((a, b) => 
  //     new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
  //   );

  //   sorted.forEach(t => {
  //     const date = new Date(t.occurred_at);
  //     // const monthYear = date.toLocaleString('default', { month: 'short' });
  //     const monthYear = date.toLocaleString('default', { 
  //       month: 'short',
  //       year: '2-digit'
  //     });
  //     const amount = Number(t.amount);
  //     const change = t.type === 'credit' ? amount : -amount;
      
  //     monthlyData[monthYear] = (monthlyData[monthYear] || 0) + change;
  //   });

  //   // 3. Convert to cumulative trend (Balance progression)
  //   let cumulativeBalance = 0;
  //   return Object.entries(monthlyData).map(([month, change]) => {
  //     cumulativeBalance += change;
  //     return { month, value: cumulativeBalance };
  //   }).slice(-6); // Last 6 months
  // }, [transactions, selectedAccountId]);

  const chartData = useMemo(() => {
  if (!transactions?.length) return [];

  const filtered = transactions.filter(t => 
    selectedAccountId === "all" || t.account_id === selectedAccountId
  );

  const monthlyMap = new Map<string, number>();

  filtered.forEach(t => {
    const date = new Date(t.occurred_at);

    // 🔥 USE ISO KEY FOR SORTING
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const amount = Number(t.amount);
    const change = t.type === "credit" ? amount : -amount;

    monthlyMap.set(key, (monthlyMap.get(key) || 0) + change);
  });

  // ✅ SORT PROPERLY
  const sorted = Array.from(monthlyMap.entries())
    .sort((a, b) => {
      const [ay, am] = a[0].split("-").map(Number);
      const [by, bm] = b[0].split("-").map(Number);
      return new Date(ay, am).getTime() - new Date(by, bm).getTime();
    });

  // ✅ BUILD CUMULATIVE TREND
  let cumulative = 0;

  return sorted.map(([key, value]) => {
    const [year, month] = key.split("-").map(Number);

    cumulative += value;

    return {
      month: new Date(year, month).toLocaleString("default", {
        month: "short",
      }),
      value: cumulative,
    };
  }).slice(-6);

}, [transactions, selectedAccountId]);
  if (accountsLoading || !transactions) return <LineChartSkeleton />;

  return (
    <div className="relative flex flex-col rounded-2xl p-6 glass backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500">
      {/* Glows */}
      <div className="glow glow-indigo -top-10 -right-10 pointer-events-none" />
      <div className="glow glow-purple -bottom-10 -left-10 pointer-events-none" />

      {/* Header with Dropdown */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative z-10">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold tracking-tight">Savings Trend</h3>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-black">Net Worth Growth</p>
        </div>

        <select 
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="glass px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase outline-none border border-white/10 bg-transparent cursor-pointer hover:bg-white/5 transition-all"
        >
          <option value="all" className="text-black">Total Trend</option>
          {accounts?.map(acc => (
            <option key={acc.id} value={acc.id} className="text-black">
              {acc.account_type.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-64 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="50%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="value"
              fill="url(#areaGradient)"
              stroke="none"
            />

            <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.05)" 
            vertical={false} />

            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)", fontWeight: 'bold' }} 
            />
            
            <YAxis
              tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(15, 15, 15, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "11px",
              }}
              itemStyle={{ color: "#fff", fontWeight: 'bold' }}
              labelStyle={{ opacity: 0.5, marginBottom: '4px' }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#lineGradient)"
              strokeWidth={4}
              // dot={{ r: 4, strokeWidth: 2, fill: "#1e1b4b", stroke: "#A78BFA" }}
              dot={(props: any) => {
              const { key, ...rest } = props;

              const dateKey = props.payload?.dateKey; // we’ll fix this below
              const isAnomaly = anomalyMonths.has(dateKey);

              if (!isAnomaly) {
                return <circle key={key} {...rest} r={3} />;
              }

              return (
                <circle
                  key={key}
                  {...rest}
                  r={6}
                  fill="#ff4d4f"
                  onClick={() => setDrill("anomaly", props.payload)}
                  className="cursor-pointer animate-pulse"
                />
              );
            }}              activeDot={{ r: 7, strokeWidth: 0, fill: "#fff" }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Footer Info */}
      <div className="mt-4 flex justify-between items-center opacity-40">
        <span className="text-[9px] font-black uppercase tracking-widest">Inflow vs Outflow</span>
        <span className="text-[9px] font-mono italic">Live Data Tracking</span>
      </div>
    </div>
  );
}
