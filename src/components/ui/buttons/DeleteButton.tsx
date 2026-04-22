'use client';

import { useState, useEffect } from 'react';
import clsx from "clsx";
import { TrashIcon } from '@heroicons/react/24/outline';

interface ShakingDeleteButtonProps {
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function DeleteButton({ onDelete, isDeleting, className, children }: ShakingDeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  // Auto-reset confirmation state after 3 seconds
  useEffect(() => {
    if (isConfirming) {
      const timer = setTimeout(() => setIsConfirming(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirming]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isConfirming) {
      // First click: show confirmation
      setIsConfirming(true);
    } else {
      // Second click: trigger delete
      await onDelete();
      setIsConfirming(false);
    }
  };

  return (
    <button 
      disabled={isDeleting}
      onClick={handleClick}
      className={clsx(
        "group relative flex items-center gap-2 px-4 py-2 rounded-lg",
        "text-sm font-medium transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
        "dark:focus:ring-offset-slate-900",
        "active:scale-95",
        isConfirming
          ? "bg-red-600 hover:bg-red-700 text-white border-0"
          : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40",
        isDeleting && "opacity-60 cursor-wait",
        className
      )}
      aria-label={isConfirming ? "Confirm deletion" : "Delete item"}
      aria-busy={isDeleting}
      type="button"
    >
      {isDeleting ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : isConfirming ? (
        <span className="text-xs font-bold uppercase animate-shake">Sure?</span>
      ) : (
        children || <TrashIcon className="w-4 h-4" />
      )}
    </button>
  );
}
