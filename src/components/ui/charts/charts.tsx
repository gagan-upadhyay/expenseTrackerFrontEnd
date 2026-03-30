// import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// export function ExpenseChart() {
//   return (
//     <div className="p-6 bg-card rounded-xl h-full border shadow-sm ">
//       <h2 className="text-xl font-bold mb-4">Monthly Spent</h2>
//       <ChartContainer config={chartConfig} className=" w-full">
//         <BarChart data={chartData}>
//           <CartesianGrid vertical={false} strokeDasharray="3 3" />
//           <XAxis dataKey="category" tickLine={false} axisLine={false} />
//           <YAxis hide />
//           <ChartTooltip content={<ChartTooltipContent />} />
//           <Bar dataKey="amount" radius={8} />
//         </BarChart>
//       </ChartContainer>
//     </div>
//   )
// }




// const chartData = [
//   { category: "Food", amount: 450, fill: "var(--color-food)" },
//   { category: "Rent", amount: 1200, fill: "var(--color-rent)" },
//   { category: "Utilities", amount: 300, fill: "var(--color-utilities)" },
//   { category: "Entertainment", amount: 200, fill: "var(--color-entertainment)" },
// ]

// const chartConfig = {
//   amount: { label: "Amount ($)" },
//   food: { label: "Food", color: "hsl(var(--chart-1))" },
//   rent: { label: "Rent", color: "hsl(var(--chart-2))" },
//   utilities: { label: "Utilities", color: "hsl(var(--chart-3))" },
//   entertainment: { label: "Entertainment", color: "hsl(var(--chart-4))" },
// }


  
"use client";

import { Pie, PieChart, Cell, Tooltip } from "recharts";
import clsx from "clsx";

import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTransactions } from "@/src/context/transactionContext";
import ExpenseChartSkeleton from "../../skeletons/chartSkeleton";

const chartData = [
  { name: "Food", value: 400 },
  { name: "Shopping", value: 300 },
  { name: "Travel", value: 200 },
  { name: "Bills", value: 150 },
  { name: "Others", value: 100 },
];

// 🎨 Better color palette (glass UI friendly)
const COLORS = [
  "#6366F1", // indigo
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#F59E0B", // amber
  "#10B981", // green
];

export function ExpenseChart() {
  const {loading} = useTransactions();
  
  if(loading) {
    return <ExpenseChartSkeleton/>
  }
  return (
    <div
      className={clsx(
        "relative flex flex-col rounded-2xl p-6",
        "glass glass-hover smooth-theme"
      )}
    >
      {/* Glow (same as your system) */}
      <div className="glow glow-indigo -top-10 -right-10"></div>
      <div className="glow glow-purple -bottom-10 -left-10"></div>

      {/* Header */}
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg font-semibold">
          Monthly Expenses
        </CardTitle>
      </CardHeader>

      {/* Chart */}
      <CardContent className="flex justify-center items-center">
        <PieChart width={260} height={260}>
          
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50} // ✅ donut style
            paddingAngle={3} // ✅ spacing between slices
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="rgba(255,255,255,0.1)" // subtle border
              />
            ))}
          </Pie>

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              background: "rgba(205, 205, 205, 0.8)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
        </PieChart>
      </CardContent>

      {/* Legend */}
      <div className="mt-1 grid grid-cols-2  text-sm">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 mx-2 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="opacity-80">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}