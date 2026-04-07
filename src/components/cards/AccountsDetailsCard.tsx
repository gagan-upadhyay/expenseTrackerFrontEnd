'use client';

import { useAccounts } from "@/src/context/accountContext";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import AccountDetailsSkeleton from "@/src/components/skeletons/accountDetailsSkeleton";
import { Button } from "../ui/buttons/buttons";
import { useState } from "react";
import { deleteAccountDetails } from "@/src/services/accountServices";
// import { useEffect } from "react";

interface Props {
  parentClass: string;
}

export default function AccountsDetailsCard({ parentClass }: Props) {
  const { accounts, loading, setAccounts} = useAccounts();
  const [deletingId, setDeletingId] = useState<string|null>(null);
  const [deleteError, setDeleteError] = useState<string|null>(null);
  const [confirmId, setConfirmId]= useState<string|null>(null);
  const router = useRouter();

  const handleDelete=async(id:string)=>{
    if(confirmId!==id){
      setConfirmId(id);
      setTimeout(()=>setConfirmId(null), 3000)
      return;
    }
    setDeletingId(id);
    setDeleteError(null);
    try{
      await deleteAccountDetails(id);
      // await refreshAccounts();
      setAccounts(prev => prev?.filter(acc => acc.id !== id));
      console.log(`Account with id: ${id} has been deleted`);
    }catch(err){
      setDeleteError(err instanceof Error ?err.message:'Something went wrong');
      console.warn("error:", err);
    }finally{
      setDeletingId(null);
    }
  }

  if (loading) {
    return <AccountDetailsSkeleton parentClass={parentClass} />;
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className={clsx(parentClass, "w-full mt-6 relative")}> 
        <div className="glass p-6 rounded-2xl">
          <p className="text-center opacity-70">No Account Found</p>
          <button
            onClick={() => router.push("/account/add")}
            className="mt-3 glass-hover w-full py-2 rounded-xl text-sm"
          >
            Add Account
          </button>
        </div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.remaining_balance), 0);
  const totalIncome = accounts.reduce((sum, acc) => sum + Number(acc.total_income), 0);
  const totalExpense = accounts.reduce((sum, acc) => sum + Number(acc.total_expense), 0);

  return (
    <div className={clsx(parentClass, "w-full mt-6 relative flex flex-col h-[80vh] md:h-auto overflow-hidden")}> 
      {/* Glow */}
      <div className="glow glow-indigo -top-10 -right-10"></div>
      <div className="glow glow-purple -bottom-10 -left-10"></div>

      {/* Header and totals */}
      <div className="glass p-4 rounded-2xl mb-4 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">My Accounts</h3>
              <p className="text-xs opacity-70">{accounts.length} account{accounts.length > 1 ? 's' : ''}</p>
              {/**Mobile view only */}
            </div>
            <button 
            onClick={() => router.push("/account/add")}
            className="md:hidden p-2 glass rounded-xl border border-white/10 active:scale-90 transition-transform"
            >
             <PlusIcon className="w-5 h-5 text-indigo-400" />
            </button>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-semibold text-indigo-400">Total Balance</span>
            <span className="font-bold tracking-tight">{getCurrencySymbol(accounts[0]?.currency_code)} {totalBalance.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] md:text-xs text-center">
          <div className="glass px-2 py-1 rounded-md">
            <p className="opacity-60 uppercase tracking-tighter">Income</p>
            <p className="font-medium text-green-500">{getCurrencySymbol(accounts[0]?.currency_code)} {totalIncome.toFixed(2)}</p>
          </div>
          <div className="glass px-2 py-1.5 rounded-md">
            <p className="opacity-60 uppercase tracking-tighter">Expense</p>
            <p className="font-medium text-red-500">{getCurrencySymbol(accounts[0]?.currency_code)} {totalExpense.toFixed(2)}</p>
          </div>
          <div className="glass px-2 py-1.5 rounded-md">
            <p className="opacity-60 uppercase tracking-tighter">Avg Remaining</p>
            <p className="font-medium">{getCurrencySymbol(accounts[0]?.currency_code)} {(totalBalance / accounts.length).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Per-account cards */}
      <div className="flex-1 overflow-y-auto pr-1 pb-24 md:pb-4 scroll-smooth">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {accounts.map((acc) => (
          
          <div key={acc.id} className="glass p-4 rounded-2xl border border-[var(--color-border)] flex flex-col justify-between hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs uppercase opacity-60 tracking-widest">{acc.account_type}</h4>
              
              <button 
                disabled={deletingId === acc.id}
                onClick={() => handleDelete(acc.id)}
                // className="group glass relative flex items-center justify-center p-2 rounded-xl border border-red-200 text-red-600 transition-all hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                className={clsx("group glass relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 active:scale-95",
                confirmId === acc.id
                ? "bg-red-600 text-white border-red-400 [animation:shake_0.2s_infinite]"
                : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              )}
              >
                {/* 3. Conditional Spinner */}
                {deletingId === acc.id ? (
                  <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : confirmId === acc.id ? (
                  <span className="text-[9px] font-black uppercase tracking-tighter">Sure?</span>
                ) : (
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {/* Trash Lid SVG Paths */}
                    <path className="transition-all duration-300 origin-bottom-left group-hover:-translate-y-1 group-hover:rotate-12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
                  </svg>
                )}
              </button>

              
            </div>
            <p className="text-2xl font-bold mt-2">
              {getCurrencySymbol(acc.currency_code)} {acc.remaining_balance}
            </p>
            <div className="mt-4 flex justify-between">
              <div className="flex gap-2 items-center justify-between text-[10px]">
              <span className="glass-light px-2 py-1.5 rounded-lg text-green-500 font-bold">INC: {getCurrencySymbol(acc.currency_code)}{acc.total_income}</span>
              <span className="glass-light  px-2 py-1.5 rounded-lg text-red-500">Expense: {getCurrencySymbol(acc.currency_code)} {acc.total_expense}</span>
              </div>
                <Button onClick={()=>router.push(`account/${acc.id}`)} className="overflow-hidden px-3 py-2 ml-3 text-[12px] sm:text-[10px]">Details</Button>
            </div>
            <p className="mt-2 text-xs opacity-70">Opening: {getCurrencySymbol(acc.currency_code)} {acc.opening_balance}</p>
            {deleteError && deletingId===acc.id && <p className="mt-2 text-[10px] animate-pulse text-red-400/40">{deleteError}</p>}
          </div>
        ))}
      </div>
      </div>

      {/* CTA: Add Transaction */}
      <Button
        onClick={() => router.push("/account/add")}
        className="hidden glass-hover mt-6 w-full py-2 rounded-xl md:flex items-center justify-center gap-2 shrink-0"
      >
        <PlusIcon className="w-4 h-4" />
        Add Account
      </Button>
    </div>
  );
}