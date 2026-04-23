import { useSmartInsights } from "@/src/Hooks/useSmartInsights";
import { Transaction } from "@/src/utils/definitions";

export default function InsightsPanel({ transactions }: { transactions: Transaction[] }) {
  const insights = useSmartInsights(transactions);

  return (
    <div className="glass glass-lg glass-rounded space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">
        AI Insights
      </h3>

      {insights.map((i, idx) => (
        <div
          key={idx}
          className="glass glass-sm glass-rounded text-xs opacity-80"
        >
          {i.text}
        </div>
      ))}
    </div>
  );
}