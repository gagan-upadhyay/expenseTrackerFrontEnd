'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { useAccounts } from "@/src/context/accountContext";

export default function TransactionFilters({ onFilterChange }: { onFilterChange: (f: any) => void }) {
  const { accounts } = useAccounts();
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    accountId: 'all',
    timeRange: 'all'
  });

  const handleUpdate = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);

    const params: any = { ...newFilters };
    const now = new Date();
    
    // Date Logic
    if (newFilters.timeRange === 'today') {
      params.from = now.toISOString().split('T')[0];
    } else if (newFilters.timeRange === 'week') {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      params.from = lastWeek.toISOString().split('T')[0];
    } else if (newFilters.timeRange === 'month') {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      params.from = lastMonth.toISOString().split('T')[0];
    }

    onFilterChange(params);
  };

  const selectClass = "glass text-xs px-2 py-1 rounded-lg bg-transparent focus:outline-none border border-white/10";

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Type Toggle */}
      <div className="flex glass rounded-lg overflow-hidden border border-white/10">
        {['all', 'debit', 'credit'].map((t) => (
          <button
            key={t}
            type="button" // Prevent accidental form submission
            onClick={() => handleUpdate('type', t)}
            className={clsx(
              "px-3 py-1 text-[10px] uppercase font-bold transition-all",
              activeFilters.type === t ? "bg-indigo-500 text-white" : "hover:bg-white/5"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Account Selector - Added VALUE prop */}
      <select 
        className={selectClass}
        value={activeFilters.accountId}
        onChange={(e) => handleUpdate('accountId', e.target.value)}
      >
        <option value="all" className="text-black">All Accounts</option>
        {accounts?.map(acc => (
          <option key={acc.id} value={acc.id} className="text-black">
            {acc.account_type?.toUpperCase()} - {acc.currency_code}
          </option>
        ))}
      </select>

      {/* Time Range Selector - Added VALUE prop */}
      <select 
        className={selectClass}
        value={activeFilters.timeRange}
        onChange={(e) => handleUpdate('timeRange', e.target.value)}
      >
        <option value="all" className="text-black">All Time</option>
        <option value="today" className="text-black">Today</option>
        <option value="week" className="text-black">Last 7 Days</option>
        <option value="month" className="text-black">Last Month</option>
      </select>
    </div>
  );
}
