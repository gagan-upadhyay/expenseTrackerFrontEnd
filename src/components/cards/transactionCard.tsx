'use client';

import { useTransactions } from "@/src/context/transactionContext";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import { 
  ArrowTrendingDownIcon, 
  ArrowTrendingUpIcon, 
  PhotoIcon, 
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import TransacationSkeleton from "../skeletons/transactionSkeleton";
import { usePathname } from "next/navigation";
import { convertToMMYY } from "@/src/utils/timeConverter";
import { Button } from "../ui/buttons/buttons";
import TransactionFilters from "./TransactionFilters";
import ImagePreviewModal from "../ui/ImagePreviewModal";
import { useState } from "react";
import { SwipeableTransaction } from "../ui/Swipable";
import RefreshButton from "../ui/buttons/RefreshButton";
import { Transaction } from "@/src/utils/definitions";


interface TransactionCardProps {
  pageClass: string;
}

export default function TransactionCard({ pageClass }: TransactionCardProps) {
  const { transactions, errorMsg, loading, fetchTransactions, deleteTransaction, removeReceiptOnly } = useTransactions();
  const path = usePathname();
  const isDashboard = path.includes('dashboard');
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction|null>(null);
  // console.log("value of transactions:", transactions);

  const redirectingToEdit =()=>{
    console.log("taking to edit page...");
    
  }
  if (errorMsg?.err === 'Request timed out') {
    return (
      <div className={clsx("glass backdrop-blur-xl p-8 rounded-[2rem] text-center space-y-4 border border-white/10", pageClass)}>
        <p className="text-sm opacity-60">Connection timed out.</p>
        <Button onClick={() => fetchTransactions()} className="glass-hover px-6 py-2 mx-auto">Try Again</Button>
      </div>
    );
  }

  return (
    <div className={clsx(
      "relative w-full h-full flex flex-col rounded-[1rem] glass backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500",
      pageClass,
      !isDashboard && "mt-5"
    )}>
      {/* Hide Scrollbar Utility */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
            {/* Background Decorative Glows */}
      <div className="glow glow-indigo -top-20 -right-20 opacity-30" />
      <div className="glow glow-purple -bottom-20 -left-20 opacity-30" />

      {/* Header */}
      <div className="p-5 flex items-center glass justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 glass rounded-xl md:block hidden bg-white/5">
            <ArrowsRightLeftIcon className="w-5 h-5  opacity-70" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">{isDashboard ? "Recent Activity" : "Transaction Ledger"}</h3>
            {!isDashboard && <p className="text-[10px] uppercase tracking-widest opacity-40  font-bold">Full Audit Log</p>}
          </div>
        </div>
        {!isDashboard && (
          <Button 
            href="/transactions/add" 
            className="glass-hover z-40 !rounded-xl md:!rounded-xl !p-2 md:!py-1.5 md:!px-4 !text-xs font-bold uppercase tracking-wider flex items-center justify-center"
          >
            {/* Shown only on Mobile */}
            <PlusIcon className="w-5 h-5 md:hidden" />
            
            {/* Shown only on Desktop */}
            <span className="hidden md:block">Add New</span>
          </Button>
        )}

      </div>

      {!isDashboard && (
        <div className="px-5 py-3 glass flex items-center justify-between border-b border-white/5 bg-white/5">
          <TransactionFilters onFilterChange={(f: any) => fetchTransactions(f)} />
            <RefreshButton onRefresh={fetchTransactions} isLoading={loading}/>       
        </div>
      )}
      

      {/* List Area */}
      <div className="p-3 glass overflow-y-auto no-scrollbar">
        {loading ? (
          <TransacationSkeleton pageClass="" skeleton />
        ) : !transactions || transactions.length === 0 ? (
          <div className="py-10 text-center opacity-40 italic text-xs">No transactions found</div>
        ) : (
          <ul className={clsx("flex flex-col", isDashboard ? "gap-1" : "gap-3")}>
            {transactions.map((transaction, index) => (
              <SwipeableTransaction swipeFor="transactions" id={transaction.id} onDelete={()=>deleteTransaction(transaction.id)} onDone={()=>redirectingToEdit} key={transaction.id||index}>
                <li 
                  key={transaction.id || index} 
                  className={clsx(
                    "group flex  transition-all", //add glass here for different layout
                    isDashboard 
                      ? "items-center gap-4 p-3 rounded-2xl hover:bg-white/5 active:scale-[0.99]" 
                      : "flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                  )}
                >
                  {/* ICON BLOCK */}
                  <div className={clsx(
                    "flex-shrink-0 flex glass-hover items-center justify-center rounded-xl border border-white/5 shadow-inner",
                    isDashboard ? "w-10 h-10" : "w-12 h-12 rounded-2xl",
                    transaction.type === "credit" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  )}>
                    {transaction.type === "credit" ? <ArrowTrendingUpIcon className="w-5 h-5" /> : <ArrowTrendingDownIcon className="w-5 h-5" />}
                  </div>

                  {/* NAME & INFO BLOCK */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center relative group/name">
                    <div className="absolute -top-10 left-0 z-50 hidden animate-in fade-in zoom-in duration-200">
                      <div className="glass backdrop-blur-md bg-white/20 px-3 py-1.5 rounded-lg border border-white/30 shadow-xl whitespace-nowrap text-xs font-medium text-white pointer-events-none">
                        {transaction.display_name}
                        <div className="absolute -bottom-1 left-4 w-2 h-2 bg-white/20 border-r border-b border-white/30 rotate-45" />
                      </div>
                    </div>
                    <span className={clsx("font-semibold truncate text-white/90", isDashboard ? "text-sm" : "text-[15px]")}>
                      {transaction.display_name}
                    </span>
                    
                    {/* Meta data: Short for Dashboard, Detailed for Page */}
                    {isDashboard ? (
                      <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">
                        {convertToMMYY(transaction.occurred_at)} • {transaction.category_code || 'General'}
                      </span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{transaction.category_code}</span>
                        <span className="text-[10px] opacity-40 font-medium flex items-center gap-1">
                          <CalendarDaysIcon className="w-3 h-3" /> {new Date(transaction.occurred_at).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] opacity-40 font-medium flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" /> {new Date(transaction.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* EXTRA DETAILS (Transaction Page Only) */}
                  {!isDashboard && (
                    <div className="hidden lg:flex items-center gap-8 px-4 border-l border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-tighter opacity-30 font-bold">Status</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          {transaction.is_active ? <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" /> : <XCircleIcon className="w-3.5 h-3.5 text-red-500" />}
                          <span className="text-[10px] font-bold uppercase">{transaction.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-tighter opacity-30 font-bold">Notes</span>
                        <span className="text-[11px] font-medium opacity-70 truncate max-w-[120px]">{transaction.description || '—'}</span>
                      </div>
                    </div>
                  )}

                  {/* AMOUNT & ACTIONS */}
                  <div className={clsx(
                    "flex items-center gap-3",
                    !isDashboard && "justify-between sm:justify-end sm:w-48 ml-auto sm:ml-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0"
                  )}>
                    <div className="text-right flex flex-col justify-center">
                      <p className={clsx(
                        "font-black tracking-tight",
                        isDashboard ? "text-sm" : "text-lg",
                        transaction.type === "credit" ? "text-green-400" : "text-white/90"
                      )}>
                        {transaction.type === "credit" ? '+' : '-'}{getCurrencySymbol(transaction.currency_code)}{Number(transaction.amount).toLocaleString()}
                      </p>
                      {!isDashboard && <span className="text-[9px] font-bold opacity-30 uppercase tracking-[0.2em]">{transaction.type}</span>}
                    </div>

                    {!isDashboard && (
                      <div className="flex items-center justify-center w-10">
                        {transaction.reference ? (
                          <button onClick={() => setSelectedTransaction(transaction)} className="glass-hover p-2.5 rounded-xl text-indigo-400 hover:text-white transition-all shadow-lg active:scale-90">
                            <PhotoIcon className="w-5 h-5" />
                          </button>
                        ) : (
                          <div className="w-5 h-5 border border-white/5 rounded flex items-center justify-center opacity-10"><PhotoIcon className="w-3 h-3" /></div>
                        )}
                      </div>
                      
                    )}
                  </div>
                </li>
              </SwipeableTransaction>
            ))}
          </ul>
        )}
      </div>

      <ImagePreviewModal onEdit={null} onDelete={selectedTransaction ? () => removeReceiptOnly(selectedTransaction.id, selectedTransaction.account_id) : undefined} isOpen={!!selectedTransaction} onClose={() => setSelectedTransaction(null)} imageUrl={selectedTransaction?.reference|| ''} title={selectedTransaction?.display_name || "Transaction Reference"} />


    </div>
  );
}
