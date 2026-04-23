"use client";

import { useDrilldown } from "@/src/Hooks/AnalyticsHooks/useDrillDown";
import { useMemo } from "react";

export function DrilldownPanel({ transactions }: { transactions: any[] }) {
  const { type, value, reset } = useDrilldown();

  const filtered = useMemo(() => {
    if (type === "category") {
      return transactions.filter(t => t.category_code === value);
    }

    if (type === "date") {
      return transactions.filter(t => {
        const d = new Date(t.occurred_at);
        return d.toLocaleString("default", { month: "short" }) === value;
      });
    }

    if (type === "anomaly") {
      return transactions.filter(t => {
        const d = new Date(t.occurred_at);
        return d.toLocaleString("default", { month: "short" }) === value.month;
      });
    }

    return [];
  }, [type, value, transactions]);

  if (type === "none") return null;

  return (
    <div className="fixed right-0 top-0 h-fit w-[400px] glass glass-lg glass-rounded border-l border-white/10 z-50 overflow-y-auto scrollbar-hide">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">
          Drilldown
        </h3>
        <button onClick={reset} className="text-xs opacity-40 hover:opacity-100">
          Close
        </button>
      </div>

      {/* Title */}
      <div className="mb-4">
        <p className="text-lg font-bold">
          {type.toUpperCase()} : {value?.name || value?.month || value}
        </p>
        <p className="text-xs opacity-40">
          {filtered.length} transactions
        </p>
      </div>

      {/* Transactions */}
      <div className="space-y-3">
        {filtered.map((tx, i) => (
          <div key={i} className="glass glass-sm glass-rounded flex justify-between">
            <div>
              <p className="text-xs font-bold">{tx.description}</p>
              <p className="text-[10px] opacity-40">{tx.category_code}</p>
            </div>
            <p className="text-xs font-mono">
              ₹{Number(tx.amount).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}