'use client';

import { useState, useEffect } from 'react';
import clsx from "clsx";
import { TrashIcon } from '@heroicons/react/24/outline';

interface ShakingDeleteButtonProps {
  onDelete: () => Promise<void>;
  isDeleting: boolean; // Renamed for clarity: is this specific item deleting?
  className?: string;
  children?:React.ReactNode;
}

export default function ShakingDeleteButton({ onDelete, isDeleting, className, children }: ShakingDeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  // Auto-reset "Sure?" state after 3 seconds
  useEffect(() => {
    if (isConfirming) {
      const timer = setTimeout(() => setIsConfirming(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirming]);

  const handleInternalClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isConfirming) {
      // First click: show "Sure?"
      setIsConfirming(true);
    } else {
      // Second click: trigger actual delete
      await onDelete();
      setIsConfirming(false);
    }
  };

  return (
    <button 
      disabled={isDeleting}
      onClick={handleInternalClick}
      className={clsx(
        "group glass relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 active:scale-95",
        isConfirming
          ? "bg-red-600 text-white border-red-400"
          : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
        className
      )}
    >
      {isDeleting ? (
        <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : isConfirming ? (
        <span className="text-[9px] font-black uppercase animate-shake tracking-tighter">
          Sure?
        </span>
      ) : (
        // <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //   <path className="transition-all duration-300 origin-bottom-left group-hover:-translate-y-1 group-hover:rotate-12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
        //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
        // </svg>
        children || <TrashIcon className='w-5 h-5'/>
      )}
    </button>
  );
}
