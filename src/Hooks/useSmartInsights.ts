"use client";
import { useMemo } from "react";

export function useSmartInsights(transactions: any[]) {
  return useMemo(() => {
    if (!transactions?.length) return [];

    const total = transactions.reduce((s, t) => s + Number(t.amount), 0);

    const byCategory: Record<string, number> = {};
    transactions.forEach(t => {
      byCategory[t.category_code || "Other"] =
        (byCategory[t.category_code || "Other"] || 0) + Number(t.amount);
    });

    const topCategory = Object.entries(byCategory).sort((a,b)=>b[1]-a[1])[0];

    const insights = [];

    if (topCategory) {
      insights.push({
        type: "spending",
        text: `${topCategory[0]} contributes ${(
          (topCategory[1] / total) * 100
        ).toFixed(1)}% of your spend`,
      });
    }

    const avg =
      total / Math.max(transactions.length, 1);

    const spikes = transactions.filter(t => Number(t.amount) > avg * 2);

    if (spikes.length) {
      insights.push({
        type: "anomaly",
        text: `${spikes.length} unusually high transactions detected`,
      });
    }

    return insights;
  }, [transactions]);
}