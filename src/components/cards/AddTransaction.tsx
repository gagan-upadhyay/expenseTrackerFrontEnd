'use client';

import clsx from "clsx";
import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { toastShowError, toastShowSuccess } from "@/src/utils/toastUtils";
import { saveOneTransaction } from "@/src/services/transactionServices";
// import { useAccounts } from "@/src/context/accountContext";


export default function AddTransactionCard() {
  const defaultCategories = ["TRANSPORT", "SALARY", "FOOD", "FEES"];

  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState<string| null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const {accounts} = useAccounts();

  const [form, setForm] = useState({
    category: "",
    amount: "",
    displayName: "",
    type: "" as "debit" | "credit",
    description: "",
    reference: null as File | null,
    occurredat: "",
  });

// amount:number, type:'debit'|'credit', displayname:string, description:string, reference:string, occurredat:Date, categorycode:string

  const handleFormSubmission = async(e:React.FormEvent)=>{
    e.preventDefault();
    if(loading) return;
    setLoading(true);
    setError(null);
    try{
      const referenceString = form.reference ? await form.reference.text() : "";
      const occurredAtDate = new Date(form.occurredat);
      const data = await saveOneTransaction(Number(form.amount), form.type, form.displayName, form.description, referenceString, occurredAtDate, form.category);
      if (typeof data === 'string') {
        // Success, data is the message
        // Optionally show success toast or reset form
        setForm({
          category: "",
          amount: "",
          displayName: "",
          type: "" as "debit" | "credit",
          description: "",
          reference: null as File | null,
          occurredat: "",
        });
        toastShowSuccess(data, Number(1000)); // if you have a success toast function
      } else {
        // Error
        setError(data.err || 'An error occurred');
        toastShowError(data.err || 'An error occurred', 500);
      }
    }catch(err:unknown){
      let errorMessage="An unexpected error occurred";
      if(err instanceof Error){
        errorMessage=err.message;
      }else if(typeof err ==='string'){
        errorMessage=err;
      }
      setError(errorMessage);
      console.warn("Value of err from transaction save:", errorMessage);
      toastShowError(errorMessage, 500);
    } finally {
      setLoading(false);
    }
  }

const handleAddCategory = () => {
  const trimmed = newCategory.trim();

  if (!trimmed) return;

  const normalized = trimmed.toUpperCase();

  const exists = categories.some(
    (cat) => cat.toLowerCase() === normalized.toLowerCase()
  );

  if (exists) {
    // Optional UX feedback
    alert("Category already exists");
    return;
  }

  setCategories([...categories, normalized]);
  setForm({ ...form, category: normalized });
  setNewCategory("");
};

  return (
    <div className={clsx( "w-full mt-6 relative")}>

      {/* Glow Effects */}
      <div className="glow glow-indigo -top-10 -right-10 z-0"></div>
      <div className="glow glow-purple -bottom-10 -left-10 z-0"></div>

      {/* Title */}
      <h3 className="text-lg md:text-xl font-semibold text-center opacity-80">
        Add Transaction
      </h3>

      {/* Form */}
      <form onSubmit={handleFormSubmission} className="mt-6 flex flex-col gap-4">

        {/* CATEGORY */}
        <div className="flex flex-col  sm:flex-row gap-2">
          <select
            className="glass px-3 py-2 rounded-xl flex-1
                        bg-transparent
                        text-[var(--color-text)]
                        dark:bg-transparent"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              placeholder="New category"
              className="glass px-2 py-2 rounded-xl w-full sm:w-28"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <button
              onClick={handleAddCategory}
              className="glass-hover px-3 rounded-xl flex z-10 items-center justify-center"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AMOUNT + TYPE */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            // type="number"
            placeholder="Amount"
            className="glass px-3 py-2 rounded-xl flex-1 no-spinner"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <div className="flex rounded-xl w-fit overflow-hidden border border-[var(--color-border)]">
            {["credit", "debit"].map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, type: t as "debit" | "credit" })}
                className={clsx(
                  "px-4 py-2 text-sm transition-all",
                  form.type === t
                    ? "bg-green-500/20"
                    : "glass"
                )}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* DISPLAY NAME  and occured_at*/}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Display name (Swiggy, Salary...)"
            className="glass px-3 py-2 rounded-xl w-[80%]"
            value={form.displayName}
            onChange={(e) =>
              setForm({ ...form, displayName: e.target.value })
            }
          />
          <input
            placeholder="Txn. date"
            className="glass px-4 py-2 rounded-xl sm:w-[20%]"
            type="date"
            value={form.occurredat}
            onChange={(e)=>setForm({...form, occurredat:e.target.value})}
            />
        </div>
        

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          rows={2}
          className="glass px-3 py-2 rounded-xl w-full resize-none"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* FILE */}
        <input
          type="file"
          className="glass px-3 py-2 rounded-xl text-sm"
          onChange={(e) =>
            setForm({ ...form, reference: e.target.files?.[0] || null })
          }
        />

        {/* CTA */}
        <button type="submit" className="glass-hover py-2 rounded-xl text-sm font-medium mt-2">
          Save Transaction
        </button>
      </form>
      {error ? <p className="text-red-400/40 mt-2 text-sm">{error}</p>:''}
    </div>
  );
}