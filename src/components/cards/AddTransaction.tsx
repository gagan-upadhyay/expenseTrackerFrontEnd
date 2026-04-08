'use client';

import clsx from "clsx";
import React, { useState } from "react";
import { PlusIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useTransactionForm } from "../settings/hooks/useTransactionForm";
import Image from "next/image";
import { useAccounts } from "@/src/context/accountContext";
// import { useTransactionForm } from "./hooks/useTransactionForm";

export default function AddTransactionCard() {
  const defaultCategories = ["TRANSPORT", "SALARY", "FOOD", "FEES"];
  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState("");

  const {accounts} = useAccounts();

  const { 
    form, setForm, preview, loading, error, handleFileChange, handleSubmit, success 
  } = useTransactionForm();

  const handleAddCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    const trimmed = newCategory.trim().toUpperCase();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories([...categories, trimmed]);
    setForm({ ...form, category: trimmed });
    setNewCategory("");
  };

  return (
    <div className="w-full mt-6 relative p-4 glass rounded-2xl">
      <div className="glow glow-indigo -top-10 -right-10" />
      <div className="glow glow-purple -bottom-10 -left-10" />

      <h3 className="text-lg font-semibold text-center opacity-80">Add Transaction</h3>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
         {/* ACCOUNT DROPDOWN */}
        <div className="flex flex-col gap-2">
          <label className="text-xs opacity-70 ml-1">Select Account</label>
          <select
            required
            className="glass px-3 py-2 rounded-xl w-full bg-transparent text-sm"
            value={form.accountId}
            onChange={(e) => setForm({ ...form, accountId: e.target.value })}
          >
            <option value="" className="text-black">Choose an account...</option>
            {accounts?.map((acc) => (
              <option key={acc.id} value={acc.id} className="text-black">
                {acc.account_type.toUpperCase()} - {acc.currency_code} (Balance: {acc.opening_balance})
              </option>
            ))}
          </select>
        </div>
        {/* Category Selection */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            className="glass px-3 py-2 rounded-xl flex-1 bg-transparent"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="" className="text-black">Select Category</option>
            {categories.map((c) => <option key={c} value={c} className="text-black">{c}</option>)}
          </select>
          <div className="flex gap-2">
            <input
              placeholder="New category"
              className="glass px-2 py-2 rounded-xl w-28"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={handleAddCategory} className="glass-hover px-3 rounded-xl">
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Amount & Type */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Amount"
            className="glass px-3 py-2 rounded-xl flex-1"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <div className="flex rounded-xl overflow-hidden border border-[var(--color-border)]">
            {["credit", "debit"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t as any })}
                className={clsx("px-4 py-2 text-xs transition-all", 
                  form.type === t ? "bg-indigo-500/40" : "glass")}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Name */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Display name"
            className="glass px-3 py-2 rounded-xl flex-1"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
          <input
            type="date"
            className="glass px-3 py-2 rounded-xl"
            value={form.occurredat}
            onChange={(e) => setForm({ ...form, occurredat: e.target.value })}
          />
        </div>

        {/* File Upload with Preview (Mirroring Profile Avatar Logic) */}
        <div className="flex items-center gap-4 glass p-3 rounded-xl">
           <label className="cursor-pointer flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition">
              <div className="w-12 h-12 glass rounded-lg flex items-center justify-center overflow-hidden">
                {preview ? (
                  <Image width={10} height={10} src={preview} alt="Receipt" className="object-cover w-full h-full" />
                ) : (
                  <PhotoIcon className="w-6 h-6" />
                )}
              </div>
              <span>{form.reference ? form.reference.name : "Upload Receipt"}</span>
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} 
              />
           </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="glass-hover py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Save Transaction"}
        </button>

        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
        {success && <p className="text-green-400 text-xs text-center">Transaction Added</p>}
         

      </form>
    </div>
  );
}
