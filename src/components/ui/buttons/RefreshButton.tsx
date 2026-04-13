// 'use client';

// import { motion } from 'framer-motion';
// import { ArrowPathIcon } from "@heroicons/react/24/outline";
// import { useTransactions } from "@/src/context/transactionContext";

// export default function RefreshButton() {
//   const { fetchTransactions, loading } = useTransactions();

//   return (
//     <button
//       onClick={() => fetchTransactions()}
//       disabled={loading}
//       className="p-2 rounded-full glass hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
//       title="Refresh Transactions"
//     >
//       <motion.div
//         animate={loading ? { rotate: 360 } : { rotate: 0 }}
//         transition={loading ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0.5 }}
//       >
//         <ArrowPathIcon className="w-5 h-5 text-white/70" />
//       </motion.div>
//     </button>
//   );
// }
'use client';

import { motion } from 'framer-motion';
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from 'clsx';

interface RefreshButtonProps {
  onRefresh: () => Promise<void> | void;
  isLoading: boolean;
  className?: string;
  iconSize?: string;
}

export default function RefreshButton({ 
  onRefresh, 
  isLoading, 
  className, 
  iconSize = "w-5 h-5" 
}: RefreshButtonProps) {
  return (
    <button
      onClick={() => onRefresh()}
      disabled={isLoading}
      className={clsx(
        "p-2 rounded-full glass hover:bg-white/10 transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
    >
      <motion.div
        animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
        transition={isLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0.3 }}
        className="flex items-center justify-center"
      >
        <ArrowPathIcon className={clsx("text-white/70", iconSize)} />
      </motion.div>
    </button>
  );
}
