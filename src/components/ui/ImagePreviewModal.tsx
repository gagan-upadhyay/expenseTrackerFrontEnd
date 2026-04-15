'use client';

import { toastShowSuccess } from '@/src/utils/toastUtils';
import { XMarkIcon, ArrowDownTrayIcon, ShareIcon, PencilSquareIcon, ArrowPathRoundedSquareIcon,  Bars3Icon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import ShakingDeleteButton from './buttons/DeleteButton';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';


interface GlobalPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  onDelete?: () => Promise<void>; // Optional if some views are read-only
  onEdit:string|null;
}

export default function ImagePreviewModal({ isOpen, onClose, imageUrl, title, onDelete, onEdit }: GlobalPreviewModalProps) {

  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const[rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [resetKey, setResetKey] = useState(0); // For resetting drag position
  const [isMenuOpen, setIsMenuOpen]= useState<boolean>(false);
  const constraintsRef = useRef(null);
  const path = usePathname();
  const isDashboard = path.includes('dashboard');

    // --- 1. DOUBLE TAP TO RESET LOGIC ---
  const lastTap = useRef(0);
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleResetView(); // Reset on double tap
    } else {
      if (zoom === 1) setZoom(1.8); // Zoom on single tap
    }
    lastTap.current = now;
  };

  const handleResetView=()=>{
    setRotation(0);
    setZoom(1);
    setResetKey(prev=>prev+1) //focus a re-mount to reset x/y positions
  }

  const handleDownload = async () => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.warn(err);
      window.open(imageUrl, '_blank'); // Last resort
    }
  };

  const wrappedDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
      onClose(); // Close modal after successful delete
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
    }
  };


  const handleShare = async ()=>{
    if(navigator.share){
      try{
        await navigator.share({title:'Receipt', text:title, url:imageUrl});
        return;
      }catch(err){
        if(err instanceof Error && err.name==='AbortError')return;
      }
    }
    if(navigator.clipboard && typeof navigator.clipboard.writeText === 'function'){
      try {
      await navigator.clipboard.writeText(imageUrl);
      toastShowSuccess("Link copied to clipboard", Number(4000));
      return;
    } catch (err) {
      console.error("Clipboard failed", err);
    }
    }
    const textArea = document.createElement("textarea");
    textArea.value = imageUrl;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toastShowSuccess("Link copied (fallback)", Number(3000));
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    document.body.removeChild(textArea);
  }

    //--------- 1. ESCAPE KEY HANDLER--------------
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMenuOpen(false);
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scroll when open
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  useEffect(()=>{
    if(!isOpen) handleResetView();
  }, [isOpen]);

  // const handleRotate=()=>setRotation(prev=>(prev+90)%360);
  // const toggleZoom=()=>setZoom(prev=>(prev===1?1.8:1));

  // const actionBtnClass = "p-3 rounded-xl transition-all duration-300 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white mix-blend-difference";
  const actionBtnClass = "p-4 rounded-full backdrop-blur-xl bg-white/10 text-white border border-white/10 shadow-2xl";


  if (!isOpen) return null;

  return (
    <div className=
    // "fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
    "fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      <div 
        className=
        // "absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out" 
        "absolute inset-0 bg-black/95 backdrop-blur-xl"
        onClick={onClose} 
      />
      
      {/* Universal Top Actions */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-[1000]">
        {/* Toggle Button (Kebab/X) */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className=
          "p-4 rounded-full glass glass-hover  text-white shadow-xl active:scale-90 transition-all ease-in-out"
        >
          {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6   h-6" />}
        </button>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="flex flex-col gap-3"
            >
              <button onClick={()=>setRotation(prev=>(prev+90)%360)} className={actionBtnClass}>
                <ArrowPathRoundedSquareIcon className="w-5 h-5"/></button>
              <button onClick={()=>handleShare()} className={actionBtnClass}><ShareIcon className="w-5 h-5"/></button>
              <button onClick={()=>handleDownload()} className={actionBtnClass}><ArrowDownTrayIcon className="w-5 h-5" /> </button>
              <ShakingDeleteButton onDelete={wrappedDelete} isDeleting={isDeleting}/>
              {isDashboard && <button onClick={()=>router.push(`/transactions/edit/${onEdit}`)} className={actionBtnClass}><PencilSquareIcon className='h-5 w-5'/></button>}
              {/* <button onClick={()=>{
                setIsMenuOpen(false);
                onClose();
                }} className="p-4 rounded-full bg-white/10 text-white border border-white/20"><XMarkIcon className="w-5 h-5"/></button> */}
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>

      <div 
      ref={constraintsRef}
      className=
      // "relative w-full h-full flex flex-col items-center justify-center"
      // "relative w-full h-full flex flex-col items-center justify-center overflow-hidden pointer-events-none"
      "relative w-full h-full flex items-center justify-center overflow-hidden touch-none"
      >
        {/* <h4 className=
        // "absolute top-8 left-8 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]"
        "absolute top-8 left-8 text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mix-blend-difference"
        >
          {title}
        </h4> */}
        

          {/* 🖼️ IMAGE VIEWPORT */}
        <motion.div 
          // key={resetKey} // 🚀 RE-MOUNTS ON RESET TO CLEAR PANS
          // drag={zoom > 1}
          // dragConstraints={constraintsRef}
          // animate={{ rotate: rotation, scale: zoom }}
          // dragMomentum={true}
          // dragElastic={0.2}
          // onTap={()=>zoom===1 && toggleZoom()}

          // transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          
          // style={{ 
          //   // This is the "Magic Sauce" for mobile
          //   touchAction: zoom > 1 ? 'none' : 'auto', 
          //   userSelect: 'none',
          //   // WebkitUserDrag: 'none'
          // }}

          // className=
          // // "relative w-[85%] h-[75vh] pointer-events-auto cursor-grab active:cursor-grabbing"
          // {clsx("relative w-[85%] h-[75vh] pointer-events-auto",
          //   zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in")}

          key={resetKey}
          drag={zoom > 1}
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          // --- 3. BETTER ZOOM BEHAVIOUR ---
          // transformTemplate keeps the scaling centered on the current pan position
          transformTemplate={({ x, y, rotate, scale }) => `translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
          onTap={handleTap}
          animate={{ rotate: rotation, scale: zoom }}
          transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          className={clsx(
            "relative w-[90%] h-[70vh] pointer-events-auto",
            zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
          )}
        >
          <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-contain select-none pointer-events-none" 
          priority 
          />
        </motion.div>
      </div>
    </div>
  );
}
