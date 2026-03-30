import clsx from "clsx";

interface AccountDetailsSkeletonProps {
  parentClass: string;
}

export default function AccountDetailsSkeleton({ parentClass }: AccountDetailsSkeletonProps) {
  return (
    <div className={clsx(parentClass, "w-full mt-6 relative")}> 
      <div className="glow glow-indigo -top-10 -right-10"></div>
      <div className="glow glow-purple -bottom-10 -left-10"></div>

      {/* Header skeleton */}
      <div className="glass p-4 rounded-2xl mb-4 animate-pulse">
        <div className="h-5 w-24 bg-gray-300/50 rounded-lg mb-2" />
        <div className="h-3 w-16 bg-gray-300/50 rounded-lg mb-4" />
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div className="h-10 bg-gray-300/50 rounded-md" />
          <div className="h-10 bg-gray-300/50 rounded-md" />
          <div className="h-10 bg-gray-300/50 rounded-md" />
        </div>
      </div>

      {/* Account card placeholders */}
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="glass p-4 rounded-2xl border border-[var(--color-border)] animate-pulse">
            <div className="h-4 w-28 bg-gray-300/50 rounded-md mb-3" />
            <div className="h-8 w-36 bg-gray-300/50 rounded-md mb-3" />
            <div className="flex gap-2 text-xs mb-2">
              <div className="h-6 flex-1 bg-gray-300/50 rounded-md" />
              <div className="h-6 flex-1 bg-gray-300/50 rounded-md" />
            </div>
            <div className="h-4 w-20 bg-gray-300/50 rounded-md" />
          </div>
        ))}
      </div>

      {/* CTA skeleton */}
      <div className="mt-6 h-10 w-full bg-gray-300/50 rounded-xl animate-pulse" />
    </div>
  );
}
