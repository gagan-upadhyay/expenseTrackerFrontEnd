import { useTheme } from "@/src/context/themeContext";
import clsx from "clsx";
import { usePathname } from "next/navigation";

interface WalletSkeletonProps{
    parentClass:string;
    skeleton:boolean;
}

export default function WalletSkeleton({parentClass, skeleton}:WalletSkeletonProps){
    const path = usePathname();
    const {theme} = useTheme();
    console.log('Value of skeleton from walletSkeleton:', skeleton);
    return(
        <div className={clsx("w-auto flex flex-col rounded-xl p-3 shadow-xl relative border-1 focus:outline-none focus:ring-2", 
            parentClass, 
            path.includes('wallet') && 'h-auto mb-3',
            !path.includes('wallet') && 'h-full',
        )}>
        {!skeleton && (
            <div className="absolute  inset-0 flex items-center justify-center z-10">
                <button className={clsx("px-4 py-2 bg-blue-600 text-sm rounded-lg shadow-md hover:bg-blue-700 transition-all hover:scale-110 ease-in-out duration-500",
                    theme==='light'&&'text-black',
                    theme==='dark' && 'text-white',
                )}>
                    Add Wallet details
                </button>
            </div>
        )}
            <div className={clsx(!skeleton &&theme==='light'? 'opacity-100 bg-dark':'opacity-50','animate-pulse')}>
                <div>
                    <h3 className="text-xl w-auto h-auto font-bold text-center"></h3>
                </div>
                {/* Amount section  */}
                <div className="flex items-center justify-center">
                    <h1 className="md:h-5 md:w-20 w-15 h-4 bg-gray-300/40 rounded-md relative top-5"></h1>
                </div>
                {/* Income and expense */}
                <div className={clsx("flex justify-center gap-4 py-6 relative top-6", 
                    // !path.includes('wallet') && 'flex-col'
                    )}>
                        <div className="md:w-20 md:h-6 w-15 h-4 rounded-md bg-gray-300/40"></div>
                        <div className="md:w-20 md:h-6 w-15 h-4 bg-gray-300/40 rounded-md"></div>
                    
                </div>
                {/* eye button */}
                <div className="absolute lg:bottom-4 sm:bottom-7 sm:right-4 sm:w-5 sm:h-5 bottom-3 lg:right-4 right-2 rounded-full lg:w-9 lg:h-9 w-5 h-5 bg-gray-300/40"></div>
            </div>
         </div>
    )
}

//     rounded-full p-2