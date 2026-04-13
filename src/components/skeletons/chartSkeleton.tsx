// 'use client';

// import clsx from "clsx";

// interface ExpenseChartSkeletonProps {
//   parentClass?: string;
// }

// export default function ExpenseChartSkeleton({
//   parentClass,
// }: ExpenseChartSkeletonProps) {
//   return (
//     <div
//       className={clsx(
//         "relative flex flex-col rounded-2xl p-6",
//         "glass glass-hover smooth-theme",
//         "overflow-hidden",
//         parentClass
//       )}
//     >
//       {/* Glow (same as real card) */}
//       <div className="glow glow-indigo -top-10 -right-10"></div>
//       <div className="glow glow-purple -bottom-10 -left-10"></div>

//       {/* Header */}
//       <div className="flex flex-col items-center mb-4 gap-2">
//         <div className="h-4 w-32 rounded-md skeleton" />
//         <div className="h-3 w-24 rounded-md skeleton opacity-70" />
//       </div>

//       {/* Donut Skeleton */}
//       <div className="flex justify-center items-center mt-4">
//         <div className="relative w-52 h-52">
          
//           {/* Outer circle */}
//           <div className="absolute inset-0 rounded-full skeleton" />

//           {/* Inner cut (donut effect) */}
//           <div className="absolute inset-6 rounded-full bg-background dark:bg-black" />

//         </div>
//       </div>

//       {/* Legend Skeleton */}
//       <div className="mt-6 grid grid-cols-2 gap-3">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <div key={i} className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full skeleton" />
//             <div className="h-3 w-20 rounded-md skeleton" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// 'use client';

// import clsx from "clsx";

// interface ExpenseChartSkeletonProps {
//   parentClass?: string;
// }

// export default function ExpenseChartSkeleton({
//   parentClass,
// }: ExpenseChartSkeletonProps) {
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

//       {/* 🔥 COLORFUL LOADER DONUT */}
//       <div className="flex justify-center items-center mt-4">
//         <div className="relative w-52 h-52">
          
//           {/* Animated gradient ring */}
//           <div
//             className="absolute inset-0 rounded-full animate-spin-slow"
//             style={{
//               background: `conic-gradient(
//                 #818CF8,
//                 #A78BFA,
//                 #F472B6,
//                 #34D399,
//                 #FBBF24,
//                 #818CF8
//               )`,
//             }}
//           />

//           {/* Inner cut (donut) */}
//           <div className="absolute inset-6 rounded-full bg-gray-300 dark:bg-gray-700" />

//         </div>
//       </div>

//       {/* Legend Skeleton */}
//       <div className="mt-6 grid grid-cols-2 gap-3">
//         {Array.from({ length: 6 }).map((_, i) => (
//           <div key={i} className="flex items-center gap-2">
//             <div
//               className="w-3 h-3 rounded-full"
//               style={{
//                 backgroundColor: [
//                   "#818CF8",
//                   "#A78BFA",
//                   "#F472B6",
//                   "#34D399",
//                   "#FBBF24",
//                   "#818CF8",
//                 ][i],
//               }}
//             />
//             <div className="h-3 w-20 rounded-md skeleton" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
'use client';

import clsx from "clsx";

export default function ExpenseChartSkeleton({ parentClass }: { parentClass?: string }) {
  return (
    <div className={clsx(
      "relative flex flex-col rounded-[2rem] p-6 glass backdrop-blur-xl border border-white/10 h-full overflow-hidden",
      parentClass
    )}>
      {/* Background Glows */}
      <div className="glow glow-indigo -top-10 -right-10 opacity-20 blur-3xl" />
      <div className="glow glow-purple -bottom-10 -left-10 opacity-20 blur-3xl" />

      {/* Header + Dropdown Skeleton */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="h-5 w-32 rounded-lg skeleton bg-white/10" />
        <div className="h-8 w-24 rounded-xl skeleton bg-white/10" />
      </div>

      {/* Animated Donut Loader */}
      <div className="flex-1 flex justify-center items-center py-4">
        <div className="relative w-48 h-48">
          <div
            className="absolute inset-0 rounded-full animate-spin-slow opacity-40"
            style={{
              background: `conic-gradient(#6366F1, #8B5CF6, #EC4899, #F59E0B, #10B981, #6366F1)`,
            }}
          />
          {/* Inner glass cut (thinner donut to match UI) */}
          <div className="absolute inset-[3.5rem] rounded-full bg-[#121212]/80 backdrop-blur-md border border-white/5" />
        </div>
      </div>

      {/* Legend Skeleton */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full skeleton opacity-50" />
            <div className="h-3 w-16 rounded-md skeleton opacity-20" />
            <div className="h-3 w-8 rounded-md skeleton ml-auto opacity-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
