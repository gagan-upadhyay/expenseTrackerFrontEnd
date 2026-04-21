// "use client";

// import {
//   CartesianGrid,
//   Line,
//   LineChart,
//   XAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import clsx from "clsx";
// import { useAccounts } from "@/src/context/accountContext";
// import LineChartSkeleton from "../../skeletons/lineChartSkeleton";

// export function SavingsChart() {
//   const {loading} = useAccounts();
//   if(loading) return <LineChartSkeleton/>
//   return (
//     <div
//       className={clsx(
//         "relative flex flex-col rounded-2xl p-6",
//         "glass glass-hover smooth-theme",
//         "overflow-hidden"
//       )}
//     >
//       {/* Glow */}
//       <div className="glow glow-indigo -top-10 -right-10"></div>
//       <div className="glow glow-purple -bottom-10 -left-10"></div>

//       {/* Header */}
//       <div className="mb-4 text-center">
//         <h3 className="text-lg font-semibold">Savings Trend</h3>
//         <p className="text-xs opacity-70">Last 6 months</p>
//       </div>

//       {/* Chart */}
//       <div className="w-full h-60">
//         <ResponsiveContainer>
//           <LineChart data={chartData}>
            
//             {/* Soft grid */}
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="rgba(255,255,255,0.1)"
//               vertical={false}
//             />

//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               axisLine={false}
//               tick={{ fontSize: 12, fill: "gray" }}
//             />

//             <Tooltip
//               contentStyle={{
//                 background: "rgba(0,0,0,0.8)",
//                 border: "none",
//                 borderRadius: "8px",
//                 color: "#fff",
//               }}
//             />

//             {/* Gradient line */}
//             <defs>
//               <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
//                 <stop offset="0%" stopColor="#818CF8" />
//                 <stop offset="50%" stopColor="#A78BFA" />
//                 <stop offset="100%" stopColor="#F472B6" />
//               </linearGradient>
//             </defs>

//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke="url(#lineGradient)"
//               strokeWidth={3}
//               dot={{
//                 r: 4,
//                 strokeWidth: 2,
//                 fill: "#0f172a",
//               }}
//               activeDot={{
//                 r: 6,
//               }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }


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
import { useTransactions } from "@/src/context/transactionContext";
import LineChartSkeleton from "../../skeletons/lineChartSkeleton";

export function SavingsChart() {
  const { accounts, loading: accountsLoading } = useAccounts();
  const { transactions, loading: transLoading } = useTransactions();
  
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");

  const chartData = useMemo(() => {
    if (!transactions) return [];

    // 1. Filter transactions by account
    const filtered = transactions.filter(t => 
      selectedAccountId === "all" || t.account_id === selectedAccountId
    );

    // 2. Group by month and calculate net change (Credit - Debit)
    const monthlyData: Record<string, number> = {};
    
    // Sort transactions by date first
    const sorted = [...filtered].sort((a, b) => 
      new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
    );

    sorted.forEach(t => {
      const date = new Date(t.occurred_at);
      const monthYear = date.toLocaleString('default', { month: 'short' });
      const amount = Number(t.amount);
      const change = t.type === 'credit' ? amount : -amount;
      
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + change;
    });

    // 3. Convert to cumulative trend (Balance progression)
    let cumulativeBalance = 0;
    return Object.entries(monthlyData).map(([month, change]) => {
      cumulativeBalance += change;
      return { month, value: cumulativeBalance };
    }).slice(-6); // Last 6 months
  }, [transactions, selectedAccountId]);

  if (accountsLoading || transLoading) return <LineChartSkeleton />;

  return (
    <div className="relative flex flex-col rounded-2xl p-6 glass backdrop-blur-xl border border-white/10 h-full overflow-hidden transition-all duration-500">
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

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)", fontWeight: 'bold' }} 
            />
            
            <YAxis 
              hide={true} 
              domain={['auto', 'auto']} 
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
              dot={{ r: 4, strokeWidth: 2, fill: "#1e1b4b", stroke: "#A78BFA" }}
              activeDot={{ r: 7, strokeWidth: 0, fill: "#fff" }}
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
