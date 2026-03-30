import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface WalletSkeletonProps{
    parentClass:string;
    skeleton:boolean;
}

export default function WalletSkeleton({parentClass, skeleton}:WalletSkeletonProps){
    const path = usePathname();
    const isWalletPage = useMemo(() => path.includes("wallet"), [path]);

    return(
        <div className={clsx(" relative flex flex-col rounded-2xl ", 
            "glass glass-hover smooth-theme",
            'animation-all duration-500',
            parentClass, 
            isWalletPage? 'h-auto mb-3 top-5': 'h-full',
        )}>
            <div className="glow glow-indigo -top-10 -right-10"></div>
            <div className="glow glow-purple -bottom-10 -left-10"></div>
            {!skeleton && (
                <div className="absolute  inset-0 flex items-center justify-center z-10">
                    <button className={clsx("px-4 py-2 bg-blue-600 text-sm rounded-lg shadow-md hover:bg-blue-700 transition-all hover:scale-110 ease-in-out duration-500 light text-black dark:text-white")}>
                        Add Wallet details
                    </button>
                </div>
            )}
            <div className={clsx(!skeleton && 'opacity-100 bg-dark dark:opacity-50')}>
                <div>
                    <h3 className="text-xl w-auto h-auto font-bold text-center">Wallet</h3>
                </div>
                
                {/* Amount section  */}
                <div className="flex  items-center justify-center">
                    <h1 className="md:h-10 skeleton md:w-30 w-25 h-7 bg-gray-300/40 rounded-md relative top-5"></h1>
                </div>
                {/* Income and expense */}
                <div className={clsx("flex justify-center gap-4 py-6  relative top-6", 
                    // !path.includes('wallet') && 'flex-col'
                    )}>
                        <div className="md:w-20 md:h-7 w-18 h-5 rounded-md bg-gray-300/40 skeleton"></div>
                        <div className="md:w-20 md:h-7 w-18 h-5 bg-gray-300/40 rounded-md  skeleton"></div>
                    
                </div>
                {/* eye button */}
            <div className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-gray-300/40 backdrop-blur-md" />
            </div>
        </div>
         
    )
}