// "use client";

// import { useMemo } from "react";

// export function useChartAnomalies(data: any[], key: string) {
//   return useMemo(() => {
//     if (!data || data.length < 3) return [];

//     const values = data.map(d => d[key]);

//     const mean = values.reduce((a, b) => a + b, 0) / values.length;

//     const variance =
//       values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
//       values.length;

//     const stdDev = Math.sqrt(variance);

//     return data.map((d) => {
//       const z = (d[key] - mean) / stdDev;
//       return {
//         ...d,
//         isAnomaly: Math.abs(z) > 1.8, // tuned threshold
//       };
//     });
//   }, [data, key]);
// }
"use client";

import { Transaction } from "@/src/utils/definitions";
import { useMemo } from "react";

export function useChartAnomalies(data: any[], key: string, transactions: Transaction[]) {
  return useMemo(() => {
    if (!data || data.length < 3) return [];

    const values = data.map(d => d[key]);

    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
      values.length;

    const stdDev = Math.sqrt(variance);

    return data.map((d) => {
      const z = (d[key] - mean) / stdDev;

      const isAnomaly = Math.abs(z) > 1.8;

      // 🔍 Find related transactions for that month
      const relatedTx = transactions.filter(t => {
        const month = new Date(t.occurred_at).toLocaleString("default", { month: "short" });
        return month === d.month;
      });

      // 📊 Category analysis
      const categoryMap: Record<string, number> = {};
      relatedTx.forEach(t => {
        const cat = t.category_code || "Other";
        categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.amount);
      });

      const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

      let reason = "";

      if (d[key] > mean) {
        reason = `Spike detected. High activity in ${topCategory?.[0] || "Unknown"}`;
      } else {
        reason = `Drop detected. Reduced financial activity`;
      }

      return {
        ...d,
        isAnomaly,
        anomalyReason: reason,
        relatedTx,
      };
    });
  }, [data, key, transactions]);
}