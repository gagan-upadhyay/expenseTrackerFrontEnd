  import { motion, AnimatePresence } from 'framer-motion';
  import { CheckIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
  import { useState } from 'react';
  import { SwipeableProps } from '@/src/utils/definitions';
  import { useRouter } from 'next/navigation';

  export const SwipeableTransaction = ({ onDone, id, onDelete,swipeFor, children }: SwipeableProps) => {
    const [swipeState, setSwipeState] = useState<'none' | 'revealed-done' | 'revealed-delete' | 'confirmed'|'edit'>('none');
    const [actionType, setActionType] = useState<'done' | 'delete'|'edit' | null>(null);

    const router = useRouter();

    const handleDragEnd = (_: any, info: any) => {
      if (swipeState === 'confirmed') return;
      const threshold = 50;
      if (info.offset.x > threshold) {
        if (swipeFor==='payables')setSwipeState('revealed-done');
        else setSwipeState('edit');
      }
      else if (info.offset.x < -threshold){
        setSwipeState('revealed-delete');}
      else setSwipeState('none');
    };

    const handleConfirm = async (e:React.MouseEvent,type:'edit'| 'done' | 'delete') => {
      e.stopPropagation();
      setActionType(type);
      if(type==='edit'){
        router.push(`'transactions/${id}/edit`)
      }
      setSwipeState('confirmed');
      
      // Wait for animation to finish before calling parent handlers
      setTimeout(() => {
        if (type === 'done') onDone?.();
        else onDelete();
      }, 800); // Duration matches the "exit" animation
    };

    return (
      <AnimatePresence>
        {swipeState !== 'confirmed' || actionType ? (
          <motion.div
            layout
            initial={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { delay: 0.5 } }}
            className="relative overflow-hidden rounded-xl mb-2 group"
          >
            {/* BACKGROUND LAYER */}
            <div className={`absolute inset-0 flex items-center justify-between px-2 transition-colors duration-300 ${
              swipeState === 'revealed-done' ? 'bg-green-400' : 
              swipeState === 'revealed-delete' ? 'bg-red-400' : 
              swipeState ===  'edit' ?'bg-blue-400':'bg-transparent'
            }`}>


              {/* ACTION BUTTON (DONE or EDIT) */}
              <div className="flex h-full items-center">
                {swipeFor === 'payables' ? (
                    <button
                      onClick={(e) => handleConfirm(e, 'done')}
                      className={`h-full w-20 flex flex-col items-center justify-center text-white transition-all ${swipeState === 'revealed-done' ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <CheckIcon className="w-6 h-6" />
                      <span className="md:inline hidden text-[8px] font-black uppercase">Confirm</span>
                    </button>
                ) : (
                    <button
                      onClick={(e) => handleConfirm(e, 'edit')}
                      className={`h-full w-20 flex flex-col items-center justify-center text-white transition-all ${swipeState === 'edit' ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <PencilIcon className="w-6 h-6" />
                      <span className="md:inline hidden text-[8px] font-black uppercase">Edit</span>
                    </button>
                )}
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={(e) => handleConfirm(e,'delete')}
                className={`h-full w-20 flex flex-col items-center justify-center text-white transition-opacity ${swipeState === 'revealed-delete' ? 'opacity-100' : 'opacity-0'}`}
              >
                <TrashIcon className="w-6 h-6" />
                <span className="md:inline hidden text-[8px] font-black uppercase">Confirm</span>
              </button>
            </div>

            {/* FRONT CONTENT LAYER */}
            {/* <motion.div
              drag={swipeState === 'confirmed' ? false : "x"}
              dragConstraints={{ left: -60, right: 60}}
              animate={{ 
                x: (swipeState === 'revealed-done' || swipeState==='edit') ? 60 : 
                  swipeState === 'revealed-delete' ? -60 : 
                  swipeState === 'confirmed' && actionType === 'done' ? 500 : // Full Swipe Right
                  swipeState === 'confirmed' && actionType === 'delete' ? -500 : // Full Swipe Left
                  0 
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              onDragEnd={handleDragEnd}
              className="relative z-10 bg-inherit bg-[#121212] rounded-xl"
            > */}
            <motion.div
              drag={swipeState === 'confirmed' ? false : 'x'}
              dragConstraints={{ left: -80, right: 80 }}
              animate={{
                x: (swipeState === 'revealed-done' || swipeState === 'edit') ? 80 : 
                    swipeState === 'revealed-delete' ? -80 : 
                    swipeState === 'confirmed' && (actionType === 'done' || actionType === 'edit') ? 500 : 
                    swipeState === 'confirmed' && actionType === 'delete' ? -500 : 0,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              onDragEnd={handleDragEnd}
              className="relative z-10 bg-[#121212] rounded-xl touch-pan-y"
            >
              {/* Status Overlay for Full Swipe */}
              {swipeState === 'confirmed' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl"
                >
                  <span className="text-white font-black uppercase tracking-widest italic text-lg">
                    {actionType === 'done' ? 'DONE!' : actionType === 'edit' ? 'REDIRECTING...' : 'DELETED'}
                  </span>
                  {(actionType === 'done' || actionType === 'edit') && (
                    <div className="ml-2">
                      <svg
                        className={`w-8 h-8 ${actionType === 'done' ? 'text-green-400' : 'text-blue-400'}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      >
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4 }}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>
              )}
              {children}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  };
