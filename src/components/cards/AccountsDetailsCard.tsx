// 'use client';

// import { useAccounts } from "@/src/context/accountContext";
// import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
// import clsx from "clsx";
// import { useRouter } from "next/navigation";
// import { PlusIcon } from "@heroicons/react/24/outline";
// import AccountDetailsSkeleton from "@/src/components/skeletons/accountDetailsSkeleton";
// import { Button } from "../ui/buttons/buttons";
// import { useState } from "react";
// import { deleteAccountDetails } from "@/src/services/accountServices";
// import ShakingDeleteButton from "../ui/buttons/DeleteButton";
// // import { useEffect } from "react";

// interface Props {
//   parentClass: string;
// }

// export default function AccountsDetailsCard({ parentClass }: Props) {
//   const { accounts, loading, setAccounts} = useAccounts();
//   const [deletingId, setDeletingId] = useState<string|null>(null);
//   const [deleteError, setDeleteError] = useState<string|null>(null);
//   // const [confirmId, setConfirmId]= useState<string|null>(null);
//   const router = useRouter();

//   const handleDelete=async(id:string)=>{
//     setDeletingId(id);
//     setDeleteError(null);
//     try{
//       await deleteAccountDetails(id);
//       // await refreshAccounts();
//       setAccounts(prev => prev?.filter(acc => acc.id !== id));
      
//     }catch(err){
//       setDeleteError(err instanceof Error ?err.message:'Something went wrong');
//       console.warn("error:", err);
//     }finally{
//       setDeletingId(null);
//     }
//   }

//   if (loading) {
//     return <AccountDetailsSkeleton parentClass={parentClass} />;
//   }

//   if (!accounts || accounts.length === 0) {
//     return (
//       <div className={clsx(parentClass, "w-full mt-6 relative")}> 
//         <div className="glass p-6 rounded-2xl">
//           <p className="text-center opacity-70">No Account Found</p>
//           <button
//             onClick={() => router.push("/account/add")}
//             className="mt-3 glass-hover w-full py-2 rounded-xl text-sm"
//           >
//             Add Account
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.remaining_balance), 0);
//   const totalIncome = accounts.reduce((sum, acc) => sum + Number(acc.total_income), 0);
//   const totalExpense = accounts.reduce((sum, acc) => sum + Number(acc.total_expense), 0);

//   return (
//     <div className={clsx(parentClass, "w-full mt-6 relative flex flex-col h-[80vh] md:h-auto overflow-hidden")}> 
//       {/* Glow */}
//       <div className="glow glow-indigo -top-10 -right-10"></div>
//       <div className="glow glow-purple -bottom-10 -left-10"></div>

//       {/* Header and totals */}
//       <div className="glass p-4 rounded-2xl mb-4 shrink-0">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//           <div className="flex items-center justify-between w-full md:w-auto">
//             <div>
//               <h3 className="text-lg md:text-xl font-semibold">My Accounts</h3>
//               <p className="text-xs opacity-70">{accounts.length} account{accounts.length > 1 ? 's' : ''}</p>
//               {/**Mobile view only */}
//             </div>
//             <button 
//             onClick={() => router.push("/account/add")}
//             className="md:hidden p-2 glass rounded-xl border z-50 border-white/10 active:scale-90 transition-transform"
//             >
//              <PlusIcon className="w-5 h-5 text-indigo-400" />
//             </button>
//           </div>
//           <div className="flex gap-3 text-sm">
//             <span className="font-semibold text-indigo-400">Total Balance</span>
//             <span className="font-bold tracking-tight">{getCurrencySymbol(accounts[0]?.currency_code)} {totalBalance.toFixed(2)}</span>
//           </div>
//         </div>
//         <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] md:text-xs text-center">
//           <div className="glass px-2 py-1 rounded-md">
//             <p className="opacity-60 uppercase tracking-tighter">Income</p>
//             <p className="font-medium text-green-500">{getCurrencySymbol(accounts[0]?.currency_code)} {totalIncome.toFixed(2)}</p>
//           </div>
//           <div className="glass px-2 py-1.5 rounded-md">
//             <p className="opacity-60 uppercase tracking-tighter">Expense</p>
//             <p className="font-medium text-red-500">{getCurrencySymbol(accounts[0]?.currency_code)} {totalExpense.toFixed(2)}</p>
//           </div>
//           <div className="glass px-2 py-1.5 rounded-md">
//             <p className="opacity-60 uppercase tracking-tighter">Avg Remaining</p>
//             <p className="font-medium">{getCurrencySymbol(accounts[0]?.currency_code)} {(totalBalance / accounts.length).toFixed(2)}</p>
//           </div>
//         </div>
//       </div>

//       {/* Per-account cards */}
//       <div className="flex-1 overflow-y-auto pr-1 pb-24 md:pb-4 scroll-smooth">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
//         {accounts.map((acc) => (
          
//           <div key={acc.id} className="glass p-4 rounded-2xl border border-[var(--color-border)] flex flex-col justify-between hover:border-white/20 transition-all">
//             <div className="flex items-center justify-between">
//               <h4 className="font-semibold text-xs uppercase opacity-60 tracking-widest">{acc.account_type}</h4>
//            <ShakingDeleteButton onDelete={()=>handleDelete(acc.id)} className="glass" deletingId={deletingId=== acc.id} />

              
//             </div>
//             <p className="text-2xl font-bold mt-2">
//               {getCurrencySymbol(acc.currency_code)} {acc.remaining_balance}
//             </p>
//             <div className="mt-4 flex justify-between">
//               <div className="flex gap-2 items-center justify-between text-[10px]">
//               <span className="glass-light px-2 py-1.5 rounded-lg text-green-500 font-bold">INC: {getCurrencySymbol(acc.currency_code)}{acc.total_income}</span>
//               <span className="glass-light  px-2 py-1.5 rounded-lg text-red-500">Expense: {getCurrencySymbol(acc.currency_code)} {acc.total_expense}</span>
//               </div>
//                 <Button onClick={()=>router.push(`account/${acc.id}`)} className="overflow-hidden px-3 py-2 ml-3 text-[12px] sm:text-[10px]">Details</Button>
//             </div>
//             <p className="mt-2 text-xs opacity-70">Opening: {getCurrencySymbol(acc.currency_code)} {acc.opening_balance}</p>
//             {deleteError && deletingId===acc.id && <p className="mt-2 text-[10px] animate-pulse text-red-400/40">{deleteError}</p>}
//           </div>
//         ))}
//       </div>
//       </div>
      

//       {/* CTA: Add Transaction */}
//       <Button
//         onClick={() => router.push("/account/add")}
//         className="hidden glass-hover mt-6 w-full py-2 rounded-xl md:flex items-center justify-center gap-2 shrink-0"
//       >
//         <PlusIcon className="w-4 h-4" />
//         Add Account
//       </Button>
//     </div>
//   );
// }


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
import ShakingDeleteButton from "../ui/buttons/DeleteButton";
import RefreshButton from "../ui/buttons/RefreshButton"; // Ensure this path is correct
import { useUser } from "@/src/context/userContext";

interface Props {
  parentClass: string;
}

export default function AccountsDetailsCard({ parentClass }: Props) {
  // Pull refreshAccounts from your AccountContext
  const { accounts, loading, setAccounts, refreshAccounts, totals } = useAccounts();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();
  console.log('value of accoutns:', accounts);
  const {user} = useUser();

  const baseCurrency = user?.base_currency || 'INR';
    const netWorth = Number(totals?.netWorth || 0);
    const income = Number(totals?.income || 0);
    const expense = Number(totals?.expense || 0);
    console.log('value of netWorth', netWorth, income, expense);

  const formatCurrency = (amount:number, code:string)=>{
    return new Intl.NumberFormat('en-IN',{
      style:'currency',
      currency:code,
      minimumFractionDigits:2,
    }).format(amount);
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteAccountDetails(id);
      // Functional update to remove from local state immediately
      setAccounts(prev => prev?.filter(acc => acc.id !== id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Something went wrong');
      console.warn("error:", err);
    } finally {
      setDeletingId(null);
    }
  };
  

  if (loading && (!accounts || accounts.length === 0)) {
    return <AccountDetailsSkeleton parentClass={parentClass} />;
  }


  if (!accounts || accounts.length === 0) {
    return (
      <div className={clsx(parentClass, "w-full mt-6 relative")}>
        <div className="glass p-6 rounded-2xl flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
             <p className="opacity-70">No Account Found</p>
             <RefreshButton onRefresh={refreshAccounts} isLoading={loading} iconSize="w-4 h-4" />
          </div>
          <button
            onClick={() => router.push("/account/add")}
            className="glass-hover w-full py-2 rounded-xl text-sm"
          >
            Add Account
          </button>
        </div>
      </div>
    );
  }

  // console.log("Value of accounts", accounts);
  // const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.remaining_balance), 0);
  // const totalIncome = accounts.reduce((sum, acc) => sum + Number(acc.total_income), 0);
  // const totalExpense = accounts.reduce((sum, acc) => sum + Number(acc.total_expense), 0);
  // const currency = accounts[0]?.currency_code || 'USD';

  return (
    <div className={clsx(parentClass, "w-full mb-10 relative flex flex-col h-[80vh] md:h-auto overflow-hidden")}>
      {/* Glow effects */}
      <div className="glow glow-indigo -top-10 -right-10"></div>
      <div className="glow glow-purple -bottom-10 -left-10"></div>

      {/* Header and totals */}
      <div className="glass p-4 rounded-2xl mb-4 ">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-lg md:text-xl font-semibold">Net Worth</h3>
                <p className="text-xs opacity-70">
                    {/* {accounts.length} account{accounts.length > 1 ? 's' : ''} */}
                    Based in {baseCurrency}
                </p>
              </div>
              
              {/* REUSABLE REFRESH BUTTON */}
              <RefreshButton 
                onRefresh={refreshAccounts} 
                isLoading={loading} 
                iconSize="w-4 h-4" 
                className="!p-1.5 mt-[-12]"
              />
            </div>

            <button
              onClick={() => router.push("/account/add")}
              className="md:hidden p-2 glass rounded-xl border z-50 border-white/10 active:scale-90 transition-transform"
            >
              <PlusIcon className="w-5 h-5 text-indigo-400" />
            </button>
          </div>

              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-indigo-400">Total Net Worth</p>
                <p className="text-2xl font-black">
                    {getCurrencySymbol(baseCurrency)} {netWorth.toLocaleString()}
                </p>
              </div>
        </div>

        {/* Financial Overview Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] md:text-xs text-center">
          <div className="glass px-2 py-1 rounded-md">
            <p className="opacity-60 uppercase tracking-tighter">Income</p>
            <p className="font-medium text-green-500">{getCurrencySymbol(baseCurrency)} {income.toLocaleString()}</p>
          </div>
          <div className="glass px-2 py-1.5 rounded-md">
            <p className="opacity-60 uppercase tracking-tighter">Expense</p>
            <p className="font-medium text-red-500">{getCurrencySymbol(baseCurrency)} {expense.toLocaleString()}</p>
          </div>
          <div className="glass px-2 py-1.5 rounded-md">
            <p className="opacity-60 uppercase tracking-tighter">Avg Remaining</p>
            <p className="font-medium">{getCurrencySymbol(baseCurrency)} something here</p>
          </div>
        </div>
      </div>

      {/* Per-account cards */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-1 pb-24 md:pb-4 scroll-smooth">
        <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
          {accounts?.map((acc) => (
            <div key={acc.id} className="glass  p-4 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/20 transition-all">
             
              <div className="flex items-center justify-between">
                
                <h4 className="font-semibold text-xs uppercase opacity-60 tracking-widest">{acc.account_type}</h4>   {acc.is_liability && (
              <p className=" px-2 py-0.5 bg-red-500/10 text-red-500 md:text-[12px] text-[10px] md:opacity-70 font-black uppercase rounded-md border border-red-500/20">
                Liability
              </p>
            )}
                  
                <ShakingDeleteButton 
                    onDelete={() => handleDelete(acc.id)} 
                    className="glass !p-1.5" 
                    isDeleting={deletingId === acc.id} 
                />
              </div>
              {/* <p className="text-2xl font-bold mt-2">
                {getCurrencySymbol(acc.currency_code)} {acc.remaining_balance}
              </p> */}
              <p className={clsx("text-2xl font-black mt-1", acc.is_liability ? "text-red-400" : "text-white")}>
                {formatCurrency(Number(acc.remaining_balance), acc.currency_code)}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2 text-[10px]">
                  <span className="glass-light px-2 py-1.5 rounded-lg text-green-500 font-bold">
                    INC: {getCurrencySymbol(acc.currency_code)}{acc.total_income}
                  </span>
                  <span className="glass-light px-2 py-1.5 rounded-lg text-red-500 font-bold">
                    EXP: {getCurrencySymbol(acc.currency_code)}{acc.total_expense}
                  </span>
                </div>
                <Button onClick={() => router.push(`account/${acc.id}`)} className="px-3 py-2 ml-3 text-[10px]">
                    Details
                </Button>
              </div>
              <p className="mt-2 text-[10px] opacity-70 italic">Opening: {getCurrencySymbol(acc.currency_code)} {acc.opening_balance}</p>
              
              {deleteError && deletingId === acc.id && (
                <p className="mt-2 text-[10px] animate-pulse text-red-400 font-medium">
                    {deleteError}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA: Add Account (Desktop) */}
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
