
// "use client";

// import { Pie, PieChart, Cell, Tooltip } from "recharts";
// import clsx from "clsx";

// import {
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useTransactions } from "@/src/context/transactionContext";
// import ExpenseChartSkeleton from "../../skeletons/chartSkeleton";

// const chartData = [
//   { name: "Food", value: 400 },
//   { name: "Shopping", value: 300 },
//   { name: "Travel", value: 200 },
//   { name: "Bills", value: 150 },
//   { name: "Others", value: 100 },
// ];

// // 🎨 Better color palette (glass UI friendly)
// const COLORS = [
//   "#6366F1", // indigo
//   "#8B5CF6", // purple
//   "#EC4899", // pink
//   "#F59E0B", // amber
//   "#10B981", // green
// ];

// export function ExpenseChart() {
//   const {loading} = useTransactions();
  
//   if(loading) {
//     return <ExpenseChartSkeleton/>
//   }
//   return (
//     <div
//       className={clsx(
//         "relative flex flex-col rounded-2xl p-6",
//         "glass glass-hover smooth-theme"
//       )}
//     >
//       {/* Glow (same as your system) */}
//       <div className="glow glow-indigo -top-10 -right-10"></div>
//       <div className="glow glow-purple -bottom-10 -left-10"></div>

//       {/* Header */}
//       <CardHeader className="items-center pb-2">
//         <CardTitle className="text-lg font-semibold">
//           Monthly Expenses
//         </CardTitle>
//       </CardHeader>

//       {/* Chart */}
//       <CardContent className="flex justify-center items-center">
//         <PieChart width={260} height={260}>
          
//           <Pie
//             data={chartData}
//             dataKey="value"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={90}
//             innerRadius={50} // ✅ donut style
//             paddingAngle={3} // ✅ spacing between slices
//           >
//             {chartData.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//                 stroke="rgba(255,255,255,0.1)" // subtle border
//               />
//             ))}
//           </Pie>

//           {/* Tooltip */}
//           <Tooltip
//             contentStyle={{
//               background: "rgba(205, 205, 205, 0.8)",
//               border: "none",
//               borderRadius: "8px",
//               color: "#fff",
//             }}
//           />
//         </PieChart>
//       </CardContent>

//       {/* Legend */}
//       <div className="mt-1 grid grid-cols-2  text-sm">
//         {chartData.map((item, index) => (
//           <div key={item.name} className="flex items-center gap-2">
//             <div
//               className="w-3 h-3 mx-2 rounded-full"
//               style={{ backgroundColor: COLORS[index] }}
//             />
//             <span className="opacity-80">{item.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState, useMemo } from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import clsx from "clsx";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/src/context/transactionContext";
import { useAccounts } from "@/src/context/accountContext";
import ExpenseChartSkeleton from "../../skeletons/chartSkeleton";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];

export function ExpenseChart() {
  const { transactions, loading } = useTransactions();
  const { accounts } = useAccounts();
  
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
            <PieChart>
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
