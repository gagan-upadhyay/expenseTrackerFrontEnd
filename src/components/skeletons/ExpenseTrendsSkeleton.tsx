'use client';

export default function ExpenseTrendSkeleton() {
  return (
    <div className="relative flex flex-col glass glass-md glass-rounded h-full overflow-hidden">

      <div className="glow glow-indigo -top-10 -right-10 opacity-20 blur-3xl" />
      <div className="glow glow-purple -bottom-10 -left-10 opacity-20 blur-3xl" />

      {/* Header */}
      <div className="flex justify-between mb-8">
        <div className="space-y-2">
          <div className="h-4 w-28 skeleton rounded-md" />
          <div className="h-2 w-20 skeleton rounded-md opacity-40" />
        </div>
        <div className="h-6 w-20 skeleton rounded-xl" />
      </div>

      {/* Chart Skeleton */}
      <div className="h-56 w-full flex items-end">
        <div className="w-full h-32 skeleton rounded-xl" />
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between">
        <div className="h-2 w-20 skeleton" />
        <div className="h-2 w-16 skeleton" />
      </div>
    </div>
  );
}