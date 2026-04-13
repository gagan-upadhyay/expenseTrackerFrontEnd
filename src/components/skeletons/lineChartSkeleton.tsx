// 'use client';

// import clsx from "clsx";

// interface SavingsChartSkeletonProps {
//   parentClass?: string;
// }

// export default function LineChartSkeleton({
//   parentClass,
// }: SavingsChartSkeletonProps) {
//   return (
//     <div
//       className={clsx(
//         "relative flex flex-col rounded-2xl p-6",
//         "glass glass-hover smooth-theme",
//         "overflow-hidden",
//         parentClass
//       )}
//     >
//       {/* Glow */}
//       <div className="glow glow-indigo -top-10 -right-10"></div>
//       <div className="glow glow-purple -bottom-10 -left-10"></div>

//       {/* Header */}
//       <div className="flex flex-col items-center mb-4 gap-2">
//         <div className="h-4 w-32 rounded-md skeleton" />
//         <div className="h-3 w-24 rounded-md skeleton opacity-70" />
//       </div>

//       {/* Chart Skeleton */}
//       <div className="relative w-full h-60 flex items-end">
        
//         {/* Animated line */}
//         <svg className="w-full h-full">
//           <path
//             d="M0,120 Q60,40 120,100 T240,80 T360,110"
//             fill="none"
//             stroke="url(#skeletonGradient)"
//             strokeWidth="3"
//             className="animate-pulse"
//           />

//           <defs>
//             <linearGradient id="skeletonGradient">
//               <stop offset="0%" stopColor="#818CF8" />
//               <stop offset="50%" stopColor="#A78BFA" />
//               <stop offset="100%" stopColor="#F472B6" />
//             </linearGradient>
//           </defs>
//         </svg>

//         {/* Fake points */}
//         <div className="absolute bottom-10 left-10 w-2 h-2 rounded-full skeleton" />
//         <div className="absolute bottom-20 left-24 w-2 h-2 rounded-full skeleton" />
//         <div className="absolute bottom-16 left-40 w-2 h-2 rounded-full skeleton" />
//         <div className="absolute bottom-24 left-60 w-2 h-2 rounded-full skeleton" />
//       </div>
//     </div>
//   );
// }

'use client';

import clsx from "clsx";

export default function LineChartSkeleton({ parentClass }: { parentClass?: string }) {
  return (
    <div className={clsx(
      "relative flex flex-col rounded-[2rem] p-6 glass backdrop-blur-xl border border-white/10 h-full overflow-hidden",
      parentClass
    )}>
      <div className="glow glow-indigo -top-10 -right-10 opacity-20 blur-3xl" />
      <div className="glow glow-purple -bottom-10 -left-10 opacity-20 blur-3xl" />

      {/* Header + Dropdown */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="h-5 w-28 rounded-lg skeleton bg-white/10" />
          <div className="h-2 w-20 rounded-md skeleton opacity-30" />
        </div>
        <div className="h-7 w-20 rounded-xl skeleton bg-white/10" />
      </div>

      {/* SVG Line Skeleton */}
      <div className="relative w-full h-56 flex items-end px-2">
        <svg className="w-full h-full opacity-30">
          <path
            d="M0,180 Q80,100 160,140 T320,80 T480,120"
            fill="none"
            stroke="url(#skeletonGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="skeletonGradient">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Data Points */}
        <div className="absolute bottom-20 left-[20%] w-2 h-2 rounded-full skeleton shadow-[0_0_8px_white]" />
        <div className="absolute bottom-32 left-[50%] w-2 h-2 rounded-full skeleton shadow-[0_0_8px_white]" />
        <div className="absolute bottom-24 left-[80%] w-2 h-2 rounded-full skeleton shadow-[0_0_8px_white]" />
      </div>

      {/* Footer Info Skeleton */}
      <div className="mt-8 flex justify-between items-center opacity-20">
        <div className="h-2 w-24 rounded-full skeleton" />
        <div className="h-2 w-16 rounded-full skeleton" />
      </div>
    </div>
  );
}
