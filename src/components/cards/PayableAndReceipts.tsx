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
      {/* BOTTOM SECTION: RECEIPTS (Category Grouped) */}
<div className="flex flex-col min-h-0 border-t border-white/10 pt-4">
  
  {/* HEADER */}
  <div className="flex items-center justify-between mb-3 px-1">
    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
      <PhotoIcon className="w-4 h-4" /> Receipt Gallery
    </h4>
  </div>

  {/* ---------------- LOGIC ---------------- */}

  {/* GROUP RECEIPTS */}
  {(() => {
    if (!transactions) {
      // 🔥 SKELETON STATE
      return (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      );
    }

    const groupedReceipts = transactions
      .filter(t => t.reference && t.reference.trim() !== "")
      .reduce((acc: Record<string, Transaction[]>, tx) => {
        const category = tx.category_code || "others";

        if (!acc[category]) acc[category] = [];
        acc[category].push(tx);

        return acc;
      }, {});

    const getCategoryLabel = (code: string) => {
      const map: Record<string, string> = {
        food: "🍔 Food",
        travel: "✈️ Travel",
        shopping: "🛍️ Shopping",
        bills: "💡 Bills",
        entertainment: "🎬 Fun",
        others: "📦 Others"
      };

      return map[code] || `📦 ${code}`;
    };

    // 🔥 EMPTY STATE
    if (Object.keys(groupedReceipts).length === 0) {
      return (
        <div className="h-40 flex flex-col items-center justify-center space-y-3 glass bg-white/5 border border-dashed border-white/10 rounded-2xl">
          <p className="text-[10px] font-bold opacity-30">
            No receipts uploaded yet
          </p>
          <Button href="/transactions/add" className="text-xs glass-hover">
            Upload First Receipt
          </Button>
        </div>
      );
    }

    // 🔥 CATEGORY GROUPED VIEW
    return (
      <div className="overflow-y-auto no-scrollbar space-y-4 pr-1 pb-4 h-[290px] mask-fade-bottom">
        {Object.entries(groupedReceipts).map(([category, receipts]) => (
          <div key={category}>
            
            {/* CATEGORY HEADER */}
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 px-1">
              {getCategoryLabel(category)}
            </p>

            {/* GRID */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {receipts.slice(0, 6).map((receipt) => (
                <div
                  key={receipt.id}
                  className="group relative aspect-square glass rounded-xl overflow-hidden border border-white/10"
                >
                  {/* SKELETON LOADER */}
                  {!loadingImages[receipt.id] && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                  )}

                  {/* IMAGE */}
                  <Image
                    src={receipt.reference!}
                    alt="Receipt"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-40 group-hover:opacity-100 transition-all duration-500 cursor-pointer"
                    onClick={() => setSelectedTransaction(receipt)}
                    onLoad={() =>
                      setLoadingImages(prev => ({
                        ...prev,
                        [receipt.id]: true
                      }))
                    }
                  />

                  {/* HOVER OVERLAY */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold transition">
                    View
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  })()}

</div>
    </div>
  );
}