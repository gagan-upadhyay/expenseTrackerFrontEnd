'use client';

export default function IncomeChartSkeleton() {
  return (
    <div className="relative flex flex-col glass glass-md glass-rounded h-full overflow-hidden">

      <div className="glow glow-indigo -top-10 -right-10 opacity-20 blur-3xl" />
      <div className="glow glow-purple -bottom-10 -left-10 opacity-20 blur-3xl" />

      {/* Header */}
      <div className="flex justify-between mb-6">
        <div className="h-4 w-28 skeleton rounded-lg" />
        <div className="h-6 w-20 skeleton rounded-xl" />
      </div>

      {/* Circle loader */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full skeleton" />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full skeleton" />
            <div className="h-3 w-16 skeleton rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}