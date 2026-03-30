// 'use client';

// import clsx from "clsx";
// import { useSidebar } from "@/src/context/sidebarContext";

// export default function MainContent({ children }: { children: React.ReactNode }) {
//   const { collapsed } = useSidebar();

//   return (
//     <div
//       className={clsx(
//         "flex-grow p-6 sm:p-12 overflow-y-auto transition-all duration-300",
//         collapsed ? "sm:ml-20" : "sm:ml-64"
//       )}
//     >
//       {children}
//     </div>
//   );
// }

'use client';

import clsx from "clsx";
import { useSidebar } from "@/src/context/sidebarContext";
import React from "react";


export default function MainContent({ children }: {children:React.ReactNode}) {
  const { collapsed } = useSidebar();

  const isExpanded = !collapsed;

  return (
    <div
      className={clsx(
        "flex-grow p-6 sm:p-12 overflow-y-auto",
        "transition-all duration-300 ease-in-out",
        isExpanded ? "sm:ml-64" : "sm:ml-20"
      )}
    >
      {children}
    </div>
  );
}