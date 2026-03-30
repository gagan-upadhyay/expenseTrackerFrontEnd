"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import clsx from "clsx";
import { useAccounts } from "@/src/context/accountContext";
import LineChartSkeleton from "../../skeletons/lineChartSkeleton";

const chartData = [
  { month: "Jan", value: 186 },
  { month: "Feb", value: 305 },
  { month: "Mar", value: 237 },
  { month: "Apr", value: 73 },
  { month: "May", value: 209 },
  { month: "Jun", value: 214 },
];

export function SavingsChart() {
  const {loading} = useAccounts();
  if(loading) return <LineChartSkeleton/>
  return (
    <div
      className={clsx(
        "relative flex flex-col rounded-2xl p-6",
        "glass glass-hover smooth-theme",
        "overflow-hidden"
      )}
    >
      {/* Glow */}
      <div className="glow glow-indigo -top-10 -right-10"></div>
      <div className="glow glow-purple -bottom-10 -left-10"></div>

      {/* Header */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold">Savings Trend</h3>
        <p className="text-xs opacity-70">Last 6 months</p>
      </div>

      {/* Chart */}
      <div className="w-full h-60">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            
            {/* Soft grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "gray" }}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(0,0,0,0.8)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />

            {/* Gradient line */}
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="50%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>

            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: "#0f172a",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}