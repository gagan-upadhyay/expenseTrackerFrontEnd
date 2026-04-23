'use client';

import React, { useMemo, useState } from 'react';
import { useTransactions } from "@/src/context/transactionContext";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import { 
  PhotoIcon, 
  PlusIcon,
  CalendarIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { Button } from "../ui/buttons/buttons";
import { SwipeableTransaction } from '../ui/Swipable';
import ImagePreviewModal from '../ui/ImagePreviewModal';
import { Transaction } from '@/src/utils/definitions';
import { useRouter } from 'next/navigation';

export default function PayablesReceiptsCard() {
  const { transactions, loading, deleteTransaction, updateTransaction, removeReceiptOnly } = useTransactions();

  const [deletingId, setDeletingId] = useState<string|null>(null);
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const router = useRouter();

  const handleDeleteReceipt = async(transactionId:string, accountId:string) =>{
    setDeletingId(transactionId);
    await removeReceiptOnly(transactionId, accountId);
    setDeletingId(null);
  }

  const payables = useMemo(() => {
    return transactions?.filter(t => 
      t.type === 'debit' && t.is_payable === true
    ) ?? [];
  }, [transactions]);

  const recentReceipts = useMemo(() => 
    transactions?.filter(t => t.reference !== null) ?? [], 
  [transactions]);

  return (
    <div className="flex flex-col h-full relative z-10 overflow-hidden">

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade-bottom {
          mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
        }
      `}</style>

      {/* ================= PAYABLES ================= */}
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

        <div className="overflow-y-auto no-scrollbar space-y-2 pr-1 h-[180px] mask-fade-bottom">

          {/* 🔥 SKELETON */}
          {loading && (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse border border-white/5" />
            ))
          )}

          {!loading && payables.length > 0 && (
            <span className="text-[9px] font-bold text-indigo-400 uppercase mb-1 block">
              {payables.length} Items Pending 
            </span>
          )}

          {!loading && payables.length > 0 ? (
            payables.map((item) => (
              <SwipeableTransaction 
                swipeFor='payables'
                key={item.id}
                onDone={() => updateTransaction(item.id, item.account_id, {
                  is_payable:false,
                  occurred_at: new Date().toISOString()
                })}
                onDelete={() => deleteTransaction(item.id)}
              >
                <div className="glass bg-white/5 p-3 flex items-center justify-between border border-white/5 hover:border-white/20 transition-all rounded-xl">
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-white/80">{item.display_name}</p>
                    <p className="text-[9px] text-indigo-400 font-black uppercase">
                      Due: {new Date(item.occurred_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3" onClick={()=>router.push(`/transactions/edit/${item.id}`)}>
                    <span className="text-xs font-black text-white">
                      {getCurrencySymbol(item.currency_code)}{Number(item.amount).toLocaleString()}
                    </span>
                    <ArrowRightIcon className="w-3 h-3 opacity-20" />
                  </div>
                </div>
              </SwipeableTransaction>
            ))
          ) : !loading && (
            <div className="h-32 flex flex-col items-center justify-center space-y-3 glass bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <p className="text-[10px] font-bold opacity-30">No future payables</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= RECEIPTS ================= */}
      <div className="flex flex-col min-h-0 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
            <PhotoIcon className="w-4 h-4" /> Receipt Gallery
          </h4>
        </div>

        <div className="overflow-y-auto no-scrollbar grid md:grid-cols-4 grid-cols-3 gap-2 pr-1 pb-4 h-[290px] mask-fade-bottom">

          {/* 🔥 RECEIPT SKELETON */}
              {loading && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-white/5 animate-pulse border border-white/5"
                  />
                ))}
              </div>
            )}

          {/* ✅ RECEIPTS */}
          {!loading && recentReceipts.length > 0 && recentReceipts.map((receipt) => (
            <div key={receipt.id} className="group relative aspect-square glass rounded-xl overflow-hidden border border-white/10">
              
              {!loadingImages[receipt.id] && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              )}

              <Image 
                src={receipt.reference!} 
                alt="Receipt"
                fill 
                className="object-cover opacity-40 group-hover:opacity-100 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedTransaction(receipt)}
                onLoad={()=>setLoadingImages(prev=>({...prev, [receipt.id]:true}))}
              />
            </div>
          ))}

          {/* 🔥 EMPTY RECEIPT PLACEHOLDER */}
          {!loading && recentReceipts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center h-full space-y-3 glass bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <PhotoIcon className="w-6 h-6 opacity-20" />
              <p className="text-[10px] font-bold opacity-30">
                No receipts uploaded
              </p>
              <p className="text-[9px] opacity-20">
                Attach receipts to transactions to view here
              </p>
            </div>
          )}

        </div>
      </div>

      {/* ================= MODAL ================= */}
      <ImagePreviewModal
        isOpen={!!selectedTransaction} 
        onEdit={selectedTransaction?.id||''}
        onClose={() => setSelectedTransaction(null)} 
        imageUrl={selectedTransaction?.reference || ''} 
        title={selectedTransaction?.display_name || "Receipt Reference"} 
        onDelete={selectedTransaction ? 
          () => handleDeleteReceipt(selectedTransaction.id, selectedTransaction.account_id) : 
          undefined
        } 
      />
    </div>
  );
}