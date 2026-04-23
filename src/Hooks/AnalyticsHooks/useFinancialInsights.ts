"use client";

import { useMemo } from "react";

export function useFinancialInsights(transactions: any[]) {
  return useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const insights: string[] = [];

    // Split data
    const credits = transactions.filter(t => t.type === "credit");
    const debits = transactions.filter(t => t.type === "debit");

    const totalIncome = credits.reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = debits.reduce((s, t) => s + Number(t.amount), 0);

    // 1️⃣ Savings health
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    if (savingsRate < 20) {
      insights.push(`⚠️ Low savings rate (${savingsRate.toFixed(1)}%). Consider reducing expenses.`);
    } else if (savingsRate > 40) {
      insights.push(`🔥 Strong savings rate (${savingsRate.toFixed(1)}%). You're doing great.`);
    }

    // 2️⃣ Spending spike detection (last vs previous)
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
    );

    const recent = sorted.slice(-10);
    const previous = sorted.slice(-20, -10);

    const recentExpense = recent
      .filter(t => t.type === "debit")
      .reduce((s, t) => s + Number(t.amount), 0);

    const prevExpense = previous
      .filter(t => t.type === "debit")
      .reduce((s, t) => s + Number(t.amount), 0);

    if (recentExpense > prevExpense * 1.5) {
      insights.push("📈 Your spending has increased significantly in recent transactions.");
    }

    // 3️⃣ Income drop
    const recentIncome = recent
      .filter(t => t.type === "credit")
      .reduce((s, t) => s + Number(t.amount), 0);

    const prevIncome = previous
      .filter(t => t.type === "credit")
      .reduce((s, t) => s + Number(t.amount), 0);

    if (recentIncome < prevIncome * 0.7) {
      insights.push("📉 Your income has decreased compared to previous period.");
    }

    // 4️⃣ Category dominance
    const categoryMap: Record<string, number> = {};
    debits.forEach(t => {
      const cat = t.category_code || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.amount);
    });

    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

    if (topCategory) {
      insights.push(`💸 Most of your spending is on ${topCategory[0]}.`);
    }

    return insights.slice(0, 4);
  }, [transactions]);
}