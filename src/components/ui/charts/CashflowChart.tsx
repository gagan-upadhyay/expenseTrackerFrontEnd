"use client";

import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { useTransactions } from "@/src/context/transactionContext";
import { useAccounts } from "@/src/context/accountContext";
import LineChartSkeleton from "../../skeletons/lineChartSkeleton";
import { useChartAnomalies } from "@/src/Hooks/AnalyticsHooks/useChartAnomalies";
import { Transaction } from "@/src/utils/definitions";

function AnomalyDetail({ data, onClose }: any) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="glass glass-lg rounded-3xl w-[400px] max-h-[80vh] overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold">Anomaly Insight</h3>
          <button onClick={onClose} className="text-xs opacity-50">Close</button>
        </div>

        {/* Content */}
        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">

          <div className="glass glass-sm rounded-xl">
            <p className="text-xs opacity-50">Month</p>
            <p className="font-bold">{data.month}</p>
          </div>

          <div className="glass glass-sm rounded-xl">
            <p className="text-xs opacity-50">Explanation</p>
            <p className="text-red-400 text-sm">{data.anomalyReason}</p>
          </div>

          <div>
            <p className="text-xs opacity-50 mb-2">Transactions</p>

            <div className="space-y-2">
              {data.relatedTx.slice(0, 5).map((t: any, i: number) => (
                <div key={i} className="glass glass-sm rounded-xl flex justify-between text-xs">
                  <span>{t.category_code || "Other"}</span>
                  <span className="font-mono">₹{Number(t.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export function CashflowChart(
  // { transactions }: { transactions: Transaction[] }
) {
  const { transactions, loading: txLoading } = useTransactions();
  const { accounts, loading: accLoading } = useAccounts();

  const [selectedAccountId, setSelectedAccountId] = useState("all");

  

  const chartData = useMemo(() => {
    if (!transactions) return [];

    const filtered = transactions.filter(
      (t) =>
        selectedAccountId === "all" || t.account_id === selectedAccountId
    );

    const monthly: Record<
      string,
      { income: number; expense: number }
    > = {};

    filtered.forEach((t) => {
      const date = new Date(t.occurred_at);
      const key = date.toLocaleString("default", { month: "short" });

      if (!monthly[key]) {
        monthly[key] = { income: 0, expense: 0 };
      }

      if (t.type === "credit") {
        monthly[key].income += Number(t.amount);
      } else {
        monthly[key].expense += Number(t.amount);
      }
    });

    const baseData = Object.entries(monthly)
      .map(([month, val]) => ({
        month,
        income: val.income,
        expense: val.expense,
        net: val.income - val.expense,
      }))
      .slice(-6);

    // 🔮 SIMPLE PREDICTION (based on last trend)
    if (baseData.length >= 2) {
      const last = baseData[baseData.length - 1];
      const prev = baseData[baseData.length - 2];

      const incomeTrend = last.income - prev.income;
      const expenseTrend = last.expense - prev.expense;

      const nextMonth = "Next";

      baseData.push({
        month: nextMonth,
        income: last.income + incomeTrend,
        expense: last.expense + expenseTrend,
        net: (last.income + incomeTrend) - (last.expense + expenseTrend),
      });
    }

    return baseData;
  }, [transactions, selectedAccountId]);

  const enrichedData = useChartAnomalies(chartData, "net", transactions ?? []);
  const [selectedAnomaly, setSelectedAnomaly] = useState<any | null>(null);

  const AnomalyDot = ({ cx, cy, payload, onClick }: any) => {
    if (!payload.isAnomaly) return null;

    return (
      <g onClick={() => onClick(payload)} style={{ cursor: "pointer" }}>
        
        {/* Glow */}
        <circle cx={cx} cy={cy} r={12} fill="rgba(239,68,68,0.15)" />

        {/* Pulse */}
        <circle cx={cx} cy={cy} r={8} fill="rgba(239,68,68,0.3)" />

        {/* Core */}
        <circle cx={cx} cy={cy} r={5} fill="#EF4444" />
      </g>
    );
  };

  if (txLoading || accLoading) return <LineChartSkeleton />;

  return (
    <div className="relative flex flex-col rounded-[2rem] glass glass-lg glass-hover border border-white/10 overflow-hidden">
      
      {/* Glow */}
      <div className="glow glow-indigo -top-10 -right-10 opacity-30" />
      <div className="glow glow-purple -bottom-10 -left-10 opacity-30" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10">
        <div>
          <h3 className="text-sm font-bold">Cashflow Intelligence</h3>
          <p className="text-[10px] opacity-40 uppercase tracking-widest">
            Real + Predicted Flow
          </p>
        </div>

        <select
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="glass px-3 py-1.5 rounded-xl text-[10px] uppercase border border-white/10 bg-transparent"
        >
          <option value="all" className="text-black">
            All Accounts
          </option>
          {accounts?.map((acc) => (
            <option key={acc.id} value={acc.id} className="text-black">
              {acc.account_type.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer>
          <LineChart data={enrichedData} syncId="analytics">
            
            <defs>
              <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const data = payload[0].payload;

                return (
                  <div className="glass p-3 rounded-xl text-[11px] border border-white/10">
                    <p className="font-bold">{data.month}</p>

                    <p className="text-green-400">
                      Income: ₹{data.income.toLocaleString()}
                    </p>
                    <p className="text-red-400">
                      Expense: ₹{data.expense.toLocaleString()}
                    </p>

                    <p className="text-indigo-300">
                      Net: ₹{data.net.toLocaleString()}
                    </p>

                    {data.isAnomaly && (
                      <p className="text-red-400 mt-2 font-bold">
                        ⚠️ Unusual activity detected
                      </p>
                    )}
                  </div>
                );
              }}
            />

            {/* Net Area */}
            <Area
              type="monotone"
              dataKey="net"
              stroke="none"
              fill="url(#netGradient)"
            />

            {/* Income */}
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={3}
              dot={(props) => (
                    <AnomalyDot {...props} onClick={setSelectedAnomaly} />
                  )}
            />

            {/* Expense */}
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              strokeWidth={3}
              dot={<AnomalyDot/>}
            />

            {/* 🔮 Prediction Line (Dashed) */}
            <Line
              type="monotone"
              dataKey="net"
              stroke="#A78BFA"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={(props) => (
                <AnomalyDot {...props} onClick={setSelectedAnomaly} />
              )}

            />
            {selectedAnomaly && (
              <AnomalyDetail
                data={selectedAnomaly}
                onClose={() => setSelectedAnomaly(null)}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between text-[10px] opacity-40">
        <span>🟢 Income</span>
        <span>🔴 Expense</span>
        <span>🟣 Net + Prediction</span>
      </div>
    </div>
  );
}