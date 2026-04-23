"use client";

export function AnomalyAlerts({ anomalies }: { anomalies: any[] }) {
  if (!anomalies.length) return null;

  return (
    <div className="glass glass-lg rounded-[2rem] border border-red-400/20">
      <h3 className="text-sm font-bold mb-4 text-red-400">
        ⚠️ Unusual Activity
      </h3>

      <div className="space-y-3">
        {anomalies.map((t, i) => (
          <div
            key={i}
            className="glass glass-sm rounded-xl text-[11px] flex justify-between"
          >
            <span className="opacity-70">
              {t.category_code || "Unknown"}
            </span>
            <span className="text-red-400 font-bold">
              ₹{Number(t.amount).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}