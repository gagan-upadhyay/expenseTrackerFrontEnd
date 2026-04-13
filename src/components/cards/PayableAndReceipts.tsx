'use client';

import React, { useMemo, useState } from 'react';
import { useTransactions } from "@/src/context/transactionContext";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import { 
  PhotoIcon, 
  XMarkIcon,
  PlusIcon,
  CalendarIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { Button } from "../ui/buttons/buttons";
import ShakingDeleteButton from '../ui/buttons/DeleteButton';
import { SwipeableTransaction } from '../ui/Swipable';

export default function PayablesReceiptsCard() {
  const { transactions, deleteTransaction, updateTransaction, removeReceiptOnly } = useTransactions();
  const [deletingId, setDeletingId] = useState<string|null>(null);
  
  const handleDeleteReceipt = async(transactionId:string, accountId:string) =>{
    setDeletingId(transactionId);
    await removeReceiptOnly(transactionId, accountId);
    setDeletingId(null);
  }

  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const payables = useMemo(() => {
    const now = new Date().getTime();
    return transactions?.filter(t => 
      t.type === 'debit' && new Date(t.occurred_at).getTime() > now
    ) ?? [];
  }, [transactions]);

  const recentReceipts = useMemo(() => 
    transactions?.filter(t => t.reference !== null) ?? [], 
  [transactions]);


  return (
    <div className="flex flex-col h-full relative z-10 overflow-hidden">
      {/* Hide Scrollbars and Define Mask for Fade */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade-bottom {
          mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
        }
      `}</style>

      {/* TOP SECTION: PAYABLES (Visible 3 items) */}
      <div className="flex flex-col min-h-0 mb-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> Upcoming Payables
          </h4>
          <Button 
            href="/transactions/add?mode=payable" 
            className="py-2.5 !px-3 !text-[9px] glass-hover flex items-center gap-1"
          >
            <PlusIcon className="w-3 h-3 md:hidden block"/> 
            <span className='md:block hidden'>Add Payable</span>
          </Button>
        </div>

        <div className="relative">
          <div className="overflow-y-auto no-scrollbar space-y-2 pr-1 h-[180px] mask-fade-bottom">
            {payables.length > 0 && (
              <span className="text-[9px] font-bold text-indigo-400 uppercase mb-1 block">
                {payables.length} Items Pending
              </span>
            )}
            {payables.length > 0 ? (
              payables.map((item) => (
                <SwipeableTransaction 
                  swipeFor='payables'
                    key={item.id}
                    onDone={() => updateTransaction(item.id, item.account_id, { occurred_at: new Date().toISOString() })}
                    onDelete={() => deleteTransaction(item.id)}
                >
                <div key={item.id} className="glass bg-white/5 p-3 flex items-center justify-between border border-white/5 hover:border-white/20 transition-all rounded-xl">
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-white/80">{item.display_name}</p>
                    <p className="text-[9px] text-indigo-400 font-black uppercase">
                      Due: {new Date(item.occurred_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-xs font-black text-white">
                      {getCurrencySymbol(item.currency_code)}{Number(item.amount).toLocaleString()}
                    </span>
                    <ArrowRightIcon className="w-3 h-3 opacity-20" />
                  </div>
                  
                </div>
                </SwipeableTransaction>
              ))
            ) : (
              <div className="h-32 flex flex-col items-center justify-center space-y-3 glass bg-white/5 border border-dashed border-white/10 rounded-2xl">
                <p className="text-[10px] font-bold opacity-30">No future payables</p>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: RECEIPTS (Visible 3 rows) */}
      <div className="flex flex-col min-h-0 border-t border-white/10 pt-4 ">
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
            <PhotoIcon className="w-4 h-4" /> Receipt Gallery
          </h4>
        </div>

        <div className="relative">
          {/* h-[210px] allows 3 rows of thumbnails with gap-2 to be visible */}
          <div className="overflow-y-auto no-scrollbar grid grid-cols-4 gap-2 pr-1 pb-4 h-[290px] mask-fade-bottom">
            {recentReceipts.map((receipt) => (
              <div key={receipt.id} className="group relative aspect-square glass rounded-xl overflow-hidden border border-white/10">
                <Image 
                  src={receipt.reference!} 
                  alt="Receipt"
                  fill 
                  className="object-cover opacity-40 group-hover:opacity-100 transition-all duration-500 cursor-pointer"
                  onClick={() => setSelectedReceipt(receipt.reference)}
                />
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <ShakingDeleteButton
                    isDeleting={deletingId===receipt.id}
                    onDelete={() => handleDeleteReceipt(receipt.id, receipt.account_id)}
                    className="!p-1 !px-1.5 !rounded-lg !bg-black/60 !backdrop-blur-xl"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 touch-none">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={() => setSelectedReceipt(null)} />
          <div className="relative glass bg-[#121212] border border-white/20 rounded-[2rem] p-4 max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
            <button onClick={() => setSelectedReceipt(null)} className="absolute top-4 right-4 z-[100] glass-hover p-2 rounded-full bg-white/10">
                <XMarkIcon className="w-6 h-6 text-white" />
            </button>
            <div className="relative flex-1 w-full rounded-xl overflow-hidden">
              <Image src={selectedReceipt} alt="Full Receipt" fill className="object-contain" priority sizes="100vw" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
