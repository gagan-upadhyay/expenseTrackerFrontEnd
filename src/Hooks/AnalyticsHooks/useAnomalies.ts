"use client";

import { Transaction } from "@/src/utils/definitions";
import { useMemo } from "react";

export function useAnomalies(transactions: Transaction[]) {
  return useMemo(() => {
    if (!transactions || transactions.length < 5) return [];

    const amounts = transactions.map(t => Number(t.amount));

    const mean =
      amounts.reduce((sum, val) => sum + val, 0) / amounts.length;

    const variance =
      amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      amounts.length;

    const stdDev = Math.sqrt(variance);

    // Z-score anomaly detection
    const anomalies = transactions.filter(t => {
      const z = (Number(t.amount) - mean) / stdDev;
      return Math.abs(z) > 2; // threshold
    });

    return anomalies.slice(0, 5);
  }, [transactions]);
}