'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTransactions } from "@/src/context/transactionContext";
import { useAccounts } from "@/src/context/accountContext";
import { useTransactionForm } from "@/src/components/settings/hooks/useTransactionForm";
import { 
  ArrowPathIcon, 
  PhotoIcon, 
//   CalendarIcon, 
  WalletIcon, 
  TagIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/buttons/buttons";
import ShakingDeleteButton from "@/src/components/ui/buttons/DeleteButton";
import { uploadTransactionReceipt } from "@/src/services/transactionServices";
import { useUnsavedChanges } from "@/src/components/settings/hooks/useUnsavedChanges";
import AuthGuard from "@/src/components/auth/Guards/AuthGuard";

export default function EditTransactionPage() {
  const params = useParams();
  const router = useRouter();
  const { transactions, updateTransaction } = useTransactions();
  const { accounts } = useAccounts();
  const { 
    form, setForm, preview, setPreview, loading, handleFileChange, success, setSuccess 
  } = useTransactionForm();

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const { proceedWithCheck } = useUnsavedChanges(isDirty, success);
  const [isInitialized, setIsInitialized] = useState(false);
  const [ imageUploadError, setImageUploadError] = useState<string | null>(null);

    useEffect(() => {
    if (isInitialized) {
        setIsDirty(true);
        setImageUploadError(null);

    };
    }, [form, preview, isInitialized]);

  // 1. Find the transaction and populate form
  useEffect(() => {
    const transactionId = params.transactionId as string;
    console.log('value of params:', params);
    const existing = transactions?.find(t => t.id === transactionId);
    if(!transactions || transactions.length===0) return;

    if (existing) {
      setForm({
        category: existing.category_code || "",
        amount: existing.amount.toString(),
        displayName: existing.display_name,
        type: existing.type as "debit" | "credit",
        description: existing.description || "",
        reference: null, // Reset file ref, we use the URL for preview
        occurred_at: new Date(existing.occurred_at).toISOString().split('T')[0],
        accountId: existing.account_id,
        isPayable:existing.is_payable,
      });
      setPreview(existing.reference);
      console.log('value of reference:', existing.reference);
      setIsInitialized(true);
    }else{
        console.warn('TransactionId not found');
    }
  }, [params.id, transactions, isInitialized]);

  // 2. Handle Submit (Override default handleSubmit for Update logic)
    const handleUpdate = async (e: React.FormEvent) => {
        console.log('inside handlUpdate');
        e.preventDefault();
        if(loading) return;
        try{
            let finalReference = preview;

            if (form.reference instanceof File) {
                const uploadRes = await uploadTransactionReceipt(form.reference);

                if (uploadRes.success && uploadRes.blobName) {
                    finalReference = uploadRes.blobName;
                    console.log("✅ Upload success:", finalReference);
                } else {
                    console.log("❌ Upload failed:", uploadRes.error);

                    // ✅ show error to user
                    setImageUploadError(uploadRes.error || "Upload failed");

                    // optional: stop form submission
                    return;
                }
            }
            const updateData = {
                category_code: form.category,
                amount:(form.amount),
                display_name:form.displayName,
                type:form.type,
                description:form.description,
                reference:finalReference,
                occurred_at: new Date(form.occurred_at).toISOString(),
            }
            console.log(`Value of updateData:${updateData}`);
            const result = await updateTransaction(params.id as string, form.accountId, updateData);
            console.log(`Value of result from page:${result}`);
            setSuccess(true);
            setTimeout(() => router.push('/transactions'), 2000);

        }catch(err:any){
            console.warn("Update failed:", err.message);
        }    
    };

  if (!isInitialized) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <ArrowPathIcon className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <AuthGuard>
        <div className=" sm:p-6 h-full pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button 
            onClick={() => proceedWithCheck(() => router.back())} 
            className="glass p-2 rounded-xl text-white/40 hover:text-white"
            >
            <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black uppercase tracking-widest text-white">Edit Transaction</h1>
        </div>

        <div className="glass rounded-[2.5rem] p-6 border border-white/10 relative overflow-hidden">
            {/* Glows */}
            <div className="glow glow-indigo -top-20 -right-20 opacity-20" />
            
            <form onSubmit={handleUpdate} className="space-y-6 h-full relative z-10">
            
            {/* Account & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 ml-1 flex items-center gap-2">
                    <WalletIcon className="w-3 h-3" /> Account
                </label>
                <select 
                    className="glass w-full p-3.5 rounded-2xl text-sm outline-none border border-white/5 focus:border-indigo-500/50 transition-all bg-transparent"
                    value={form.accountId}
                    onChange={(e) => setForm({...form, accountId: e.target.value})}
                >
                    {accounts?.map(acc => (
                    <option key={acc.id} value={acc.id} className="text-black">
                        {acc.account_type} ({acc.currency_code})
                    </option>
                    ))}
                </select>
                </div>

                <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 ml-1 flex items-center gap-2">
                    <TagIcon className="w-3 h-3" /> Category
                </label>
                <input 
                    className="glass w-full p-3.5 rounded-2xl text-sm outline-none border border-white/5 focus:border-indigo-500/50 bg-transparent"
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                />
                </div>
            </div>

            {/* Amount & Display Name */}
            <div className="space-y-4">
                <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 ml-1 flex items-center gap-2">
                    <DocumentTextIcon className="w-3 h-3" /> Label
                </label>
                <input 
                    required
                    className="glass w-full p-4 rounded-2xl text-base font-bold outline-none border border-white/5 focus:border-indigo-500/50 bg-transparent text-white"
                    value={form.displayName}
                    onChange={(e) => setForm({...form, displayName: e.target.value})}
                />
                </div>

                <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 ml-1 flex items-center gap-2">
                    <CurrencyDollarIcon className="w-3 h-3" /> Amount
                </label>
                <input 
                    type="number"
                    step="any"
                    className="glass w-full p-4 rounded-2xl text-2xl font-black outline-none border border-white/5 focus:border-indigo-500/50 bg-transparent text-indigo-400"
                    value={form.amount}
                    onChange={(e) => setForm({...form, amount: e.target.value})}
                />
                </div>
            </div>

            {/* Receipt Section */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 ml-1 flex items-center gap-2">
                <PhotoIcon className="w-3 h-3" /> Receipt Reference
                </label>
                
                {preview ? (
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                    <Image 
                    // src={preview}  alt="Receipt" fill className="object-cover" 
                    src={preview} 
                    alt="Receipt" 
                    fill 
                    
                    className={clsx("object-cover",
                        imageUploadError?'border-red-400':''
                     )}
                    // style={{ height: 'auto' }} 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer glass p-3 rounded-xl hover:bg-white/20">
                        <ArrowPathIcon className="w-6 h-6 text-white" />
                        <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                    <ShakingDeleteButton 
                        isDeleting={false} 
                        onDelete={async () => { setPreview(null); setForm({...form, reference: null}) }}
                        className="!p-3 !rounded-xl"
                    />
                    </div>
                </div>
                ) : (
                <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-3xl hover:bg-white/5 transition-all cursor-pointer">
                    <PhotoIcon className="w-8 h-8 text-white/20" />
                    <span className="text-[10px] font-bold text-white/40 uppercase mt-2">Upload New Receipt</span>
                    <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
                )}
                <p className="text-red-400 text-sm">{imageUploadError?imageUploadError:''}</p>
            </div>

            {/* Date & Submit */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex-1">
                    {/* <CalendarIcon className=" flex absolute mt-4 w-5 h-5" /> */}
                    <input 
                    type="date"
                    className="glass w-full p-4 rounded-2xl text-sm outline-none border border-white/5 [color-scheme:dark] bg-transparent"
                    value={form.occurred_at}
                    onChange={(e) => setForm({...form, occurred_at: e.target.value})}
                    />
                </div>
                <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin mx-auto" /> : "Save Changes"}
                </Button>
            </div>
        </form>

            {/* Success Overlay */}
            <AnimatePresence>
            {success && (
                <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center"
                >
                <div className="bg-green-500 p-4 rounded-full mb-4">
                    <CheckCircleIcon className="w-12 h-12 text-white" />
                </div>
                <p className="text-white font-black uppercase tracking-widest">Update Successful</p>
                <p className="text-white/40 text-[10px] mt-2 font-bold">Redirecting to dashboard...</p>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
        </div>
    </AuthGuard>
  );
}