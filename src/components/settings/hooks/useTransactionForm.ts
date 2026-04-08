'use client';

import { useState, useEffect, FormEvent } from "react";
import { saveOneTransaction, uploadTransactionReceipt } from "@/src/services/transactionServices";
import { toastShowError, toastShowSuccess } from "@/src/utils/toastUtils";
import { useTransactions } from "@/src/context/transactionContext";

export function useTransactionForm() {
    const {fetchTransactions} = useTransactions();
  const [form, setForm] = useState({
    category: "",
    amount: "",
    displayName: "",
    type: "" as "debit" | "credit",
    description: "",
    reference: null as File | null,
    occurredat: "",
    accountId:"",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);   

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (file: File) => {
    setPreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, reference: file }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      let referenceBlobName:string="";

      // ✅ 1. Upload File to Azure FIRST (Mirroring Profile Logic)
      if (form.reference) {
        const uploadRes = await uploadTransactionReceipt(form.reference);
        if (!uploadRes?.success || !uploadRes.blobName) throw new Error("Receipt upload failed");
        referenceBlobName = uploadRes.blobName; 
      }

      // ✅ 2. Save Transaction with the returned Blob Name
      const occurredAtDate = new Date(form.occurredat);
      const data = await saveOneTransaction(
        Number(form.amount),
        form.type,
        form.displayName,
        form.description,
        referenceBlobName, // Now sending the string reference
        occurredAtDate,
        form.category,
        form.accountId,
      );

      if (typeof data === 'string') {
        fetchTransactions();
        setSuccess(true);
        toastShowSuccess(data, 1000);
        // Reset Form
        setForm({
          category: "",
          amount: "",
          displayName: "",
          type: "" as "debit" | "credit",
          description: "",
          reference: null as File | null,
          occurredat: "",
          accountId:"",
        });
        setPreview(null);
      } else {
        throw new Error(data.err || "Failed to save transaction");
      }
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred";
      setError(msg);
      toastShowError(msg, 1500);
    } finally {
      setLoading(false);
    }
  };

  return { form, setForm, preview, loading, error, handleFileChange, handleSubmit, success };
}
