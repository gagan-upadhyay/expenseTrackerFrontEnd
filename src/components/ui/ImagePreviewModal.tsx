'use client';

import { XMarkIcon, ArrowDownTrayIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import ShakingDeleteButton from './buttons/DeleteButton';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
//   onDelete:()=>void;
}

export default function ImagePreviewModal({ isOpen, onClose, imageUrl, title }: ImagePreviewModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Close on 'Esc' key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Top Bar Actions */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-[110]">
        <a 
          href={imageUrl} 
          download 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Download Receipt"
        >
          <ArrowDownTrayIcon className="w-6 h-6" />
        </a>
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <ShakingDeleteButton />
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {title && <h4 className="absolute top-6 left-6 text-white/70 text-sm font-medium">{title}</h4>}
        
        <div 
          className={clsx(
            "relative transition-transform duration-300 cursor-zoom-in",
            isZoomed ? "scale-150 cursor-zoom-out" : "scale-100"
          )}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <Image
            height={400}
            width={400} 
            src={imageUrl} 
            alt="Transaction Receipt" 
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
          {!isZoomed && (
            <div className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-lg text-white/50 pointer-events-none sm:hidden">
              <MagnifyingGlassPlusIcon className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
