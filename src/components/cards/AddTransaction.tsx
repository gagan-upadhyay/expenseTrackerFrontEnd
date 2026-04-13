'use client';

import clsx from "clsx";
import React, { useState, useMemo, useEffect } from "react";
import { PlusIcon, PhotoIcon, CalendarIcon, WalletIcon, TagIcon, CheckCircleIcon, CurrencyDollarIcon, DocumentTextIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTransactionForm } from "../settings/hooks/useTransactionForm";
import Image from "next/image";
import { useAccounts } from "@/src/context/accountContext";
import { useTransactions } from "@/src/context/transactionContext";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ShakingDeleteButton from "../ui/buttons/DeleteButton";
import { Button } from "../ui/buttons/buttons";

export default function AddTransactionCard() {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const { 
    form, setForm, preview, setPreview, loading, error, handleFileChange, handleSubmit, success, setSuccess, isPayablemode, setIsPayablemode,
  } = useTransactionForm();
 
  //---------------categories setup-------------------
  ;
  const defaultCategories = ["TRANSPORT", "SALARY", "FOOD", "FEES"];
  
  // Memoize to prevent recalculating categories on every render
  const initialCategories = useMemo(() => {
    const saved = transactions?.map(t => t.category_code) ?? [];
    const filteredArray=saved.filter(item=>item!=="");
    return [...new Set([...defaultCategories, ...filteredArray])];
  }, [transactions]);

  console.log('Value if initialCategories:', initialCategories);
  const [categories, setCategories] = useState(initialCategories);
  // const [category, setCategory] = useState('');
  
  console.log('Value of categories:',  categories);
  const [newCategory, setNewCategory] = useState("");
  const [categoryError, setCategoryError] = useState(false);

    const handleAddCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    const trimmed = newCategory.trim().toUpperCase();
    if (!trimmed || categories.includes(trimmed)) {
      setCategoryError(true);
      return;
    };
    setCategories([...categories, trimmed]);
    setForm({ ...form, category: trimmed });
    setNewCategory("");
  };

//------------------------------------------------------------
  const [AmountError, setAmountError] = useState(false);
  const selectedAccount = accounts?.find(acc=>String(acc.id)===String(form.accountId));
  const remainingBalance = selectedAccount?Number(selectedAccount.remaining_balance):Number(0);

  const handleAmountChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const val =e.target.value;
    setForm({...form, amount:val});
    if(val && Number(val)>remainingBalance){
      setAmountError(true)
    }else{
      setAmountError(false);
    }
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  //-------------payable setup---------------------
  const searchParams = useSearchParams();
  setIsPayablemode(searchParams.get('mode') === 'payable');
  
  const isAccountId = searchParams.get('accountId');
  if(isAccountId) form.accountId=isAccountId;

  useEffect(() => {
    if (isPayablemode) {
      setForm(prev => ({ ...prev, type: "debit" }));
    }
  }, [isPayablemode, setForm]);

  //--------------------

  // Reset shake animation state
  useEffect(() => {
    if (categoryError) {
      const timer = setTimeout(() => setCategoryError(false), 400);
      return () => clearTimeout(timer);
    }
  }, [categoryError]);

  // ----dynamic input labels and placeholders----------------------
    const inputLabel = isPayablemode ? "Expense Target" : !form.type ? "Detail" : form.type === 'debit' ? "Outgoing To" : "Incoming From";
  const getPlaceholder = () => isPayablemode ? "Where will it go?" : !form.type ? "Description here" : form.type === 'debit' ? "Where did it go?" : "Where did it come from?";
  // ----------------------------------------------------------------------
    const today=new Date().toISOString().split('T')[0];


  return (
    <div className="w-full relative p-6 glass rounded-[2rem] mt-5 backdrop-blur-xl rounded-[1rem] border border-white/20 shadow-2xl overflow-hidden transition-all duration-500">
      {/* Background Decorative Glows */}
      <div className="glow glow-indigo -top-20 -right-20 opacity-30" />
      <div className="glow glow-purple -bottom-20 -left-20 opacity-30" />

      {/* SUCCESS OVERLAY */}
       <AnimatePresence>
         {success && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
           >
             <motion.div 
               initial={{ scale: 0.5 }} animate={{ scale: 1 }}
               className="bg-green-500 p-4 rounded-full"
             >
               <CheckCircleIcon className="w-12 h-12 text-white" />
             </motion.div>
             <p className="text-white font-black uppercase mt-4">Entry Saved</p>
         </motion.div>
         )}
       </AnimatePresence>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-center mb-6 tracking-tight text-white/90">
          {isPayablemode ? "Schedule Payable" : "Add Transaction"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Account Selection */}
         { !isAccountId && <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
              <WalletIcon className="w-4 h-4" /> Select Account
            </label>
            <select
              required
              className="glass px-4 py-3 rounded-2xl w-full bg-transparent text-sm outline-none focus:border-white/40 transition-all appearance-none"
              value={form.accountId}
              onChange={(e) => setForm({ ...form, accountId: e.target.value })}
            >
              <option value="" className="text-black">Choose account...</option>
              {accounts?.map((acc) => (
                <option key={acc.id} value={acc.id} className="text-black">
                  {acc.account_type.toUpperCase()} — {acc.currency_code} ({acc.remaining_balance})
                </option>
              ))}
            </select>
          </div>}

          {/* Category Section */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
              <TagIcon className="w-3 h-3" /> Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                className="glass px-4 py-3 rounded-2xl text-sm bg-transparent outline-none focus:border-white/40"
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="" className="text-black">Select Category</option>
                {categories.map((c) => <option key={c} value={c} className="text-black">{c}</option>)}
              </select>
              
              <div className="flex gap-2">
                <input
                  placeholder="New custom..."
                  className={clsx(
                    "glass flex-1 px-4 py-3 text-sm rounded-2xl outline-none transition-all border border-transparent",
                    categoryError ? "border-red-500/50 animate-shake bg-red-500/5" : "focus:border-white/40"
                  )}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={handleAddCategory} 
                  className="glass-hover aspect-square w-12 flex items-center justify-center rounded-2xl active:scale-90 transition-transform"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Amount & Transaction Type */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-3 space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40">
                <DocumentTextIcon className="w-3 h-3" /> {inputLabel}
              </label>
              <input required
              placeholder="Display name"
              className="glass px-4 py-3 rounded-2xl w-full text-sm text-white outline-none"
                value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              />
            </div>

            <div className="flex-2 space-y-1.5 mb-2">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase  text-white/40 ml-1">
                 <CurrencyDollarIcon className="w-4 h-4" /> Amount
               </label>
              <input
                required
                type="number"
                placeholder="0.00"
                step="any"
                className={`glass px-4 py-2 rounded-2xl w-full text-lg font-semibold outline-none transition-all 
                ${AmountError ? 'border-red-500 border-2 animate-shake bg-red-500/5' : 'focus:border-white/40'} 
                placeholder:text-white/20`}
                value={form.amount}
                onChange={handleAmountChange}
              />
                {AmountError && (
                  <p className="text-red-500 inset-y-1 text-[10px] font-bold uppercase ml-2 animate-pulse">
                    Fund are low
                  </p>
                )}
            </div>
            
            {!isPayablemode && 
            <div className=" space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                 <CurrencyDollarIcon className="w-4 h-4" /> Type
               </label>
              <div className="flex glass p-1 w-fit rounded-2xl h-12 border border-white/5">
                {["credit", "debit"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t as any })}
                    className={clsx(
                      "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all", 
                      form.type === t ? "bg-white text-black shadow-lg" : "hover:bg-white/5 text-white/60"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            }
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/40">
                  <DocumentTextIcon className="w-3 h-3" /> Notes
                </label>
                <input 
                placeholder={getPlaceholder()}
                className="glass px-4 py-3 rounded-xl w-full text-sm text-white outline-none"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            {/**Date picker */}
           <div className="space-y-1">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
              <CalendarIcon className="w-4 h-4" /> {isPayablemode ? "Due Date" : "Date Occurred"}
            </label>
            <input
              required
              type="date"
              min={isPayablemode?today:undefined} 
              className="glass px-4 py-3.5 rounded-2xl w-full text-sm text-white outline-none [color-scheme:dark]"
              value={form.occurred_at}
              onChange={(e) => setForm({ ...form, occurred_at: e.target.value||today })}
            />
          </div>
          </div>

             {/* Receipt Upload */}
           <div className="space-y-3">
             <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
               <PhotoIcon className="w-4 h-4" /> Receipt (Optional)
             </label>

             
            {!preview ? (
              <label className="flex flex-col items-center justify-center py-6 rounded-2xl border-2 border-dashed border-white/10 cursor-pointer hover:bg-white/5 transition-all">
                <PhotoIcon className="w-6 h-6 opacity-20" />
                <span className="text-[9px] font-bold text-white/30 uppercase mt-1">Add Image</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            ) : (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/20">
                <Image src={preview} alt="Preview" fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <ShakingDeleteButton
                    isDeleting={false}
                    onDelete={async () => { setForm({ ...form, reference: null }); setPreview(null); }}
                    className="!p-2 !rounded-lg !bg-black/80"
                  />
                </div>
              </div>
            )}

          </div>

          {/* {error && <p className="text-red-400 text-[10px] font-bold text-center">{error}</p>} */}

          <Button
            type="submit"
            disabled={loading||AmountError}
            className={clsx(
              "w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all",
              loading || AmountError ? "bg-white/10 text-white/20 cursor-not-allowed" : "bg-white text-white hover:scale-[1.02] active:scale-95 shadow-lg"
            )}
          >
        {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin mx-auto" /> : (isPayablemode ? "Schedule Payable" : "Save Transaction")}
       </Button>
          {/* Notifications */}
          <div className="min-h-[20px]">
            {error && <p className="text-red-400 text-[10px] font-bold text-center uppercase tracking-widest animate-pulse">{error}</p>}
            {success && <p className="text-green-400 text-[10px] font-bold text-center uppercase tracking-widest animate-bounce">Transaction Logged!</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

