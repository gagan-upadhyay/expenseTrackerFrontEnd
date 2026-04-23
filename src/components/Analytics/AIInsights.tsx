"use client";

export function AIInsights({ insights }: { insights: string[] }) {
  if (!insights.length) return null;

  return (
    <div className="glass glass-lg rounded-[2rem] border border-white/10">
      <h3 className="text-sm font-bold mb-4 opacity-80">
        AI Insights
      </h3>

      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="glass glass-sm rounded-xl text-[11px] opacity-80 hover:opacity-100 transition"
          >
            {insight}
          </div>
        ))}
      </div>
    </div>
  );
}