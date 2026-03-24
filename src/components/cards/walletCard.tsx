'use client';
import { useAccounts } from "@/src/context/accountContext";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState } from "react";
import WalletSkeleton from "../skeletons/walletSkeleton";

interface WalletCardProps{
    parentClass:string;
    transitionClass:string;
}

export default function WalletCard({parentClass, transitionClass}:WalletCardProps){
    const [showSensitive, setShowSensitive] = useState(false);
    const toggleVisibility = ()=>setShowSensitive(!showSensitive);
    const {accounts, loading} = useAccounts();
    // console.log(' Value of accounts from walletCard:', accounts);
    const path = usePathname();
    // console.log('Value of path:', path.includes('wallet'));
    
    function ArrowFunction({type}:{type:string}){
        return(
            <div className="flex mx-2">
                <div className="flex justify-center">
                    <div className={clsx("lg:h-5 lg:w-5 h-4 w-4 relative top-8 mr-1 rounded-sm custom-gray-shadow",
                    type==='up' && 'bg-green-300/80 text-green-600',
                    type==='down' && 'bg-red-300/80 text-red-600'
                    )}>
                    {type==='down'?
                        <ArrowTrendingDownIcon/>
                        :
                        <ArrowTrendingUpIcon/>}
                    </div>
                    <div className={clsx("flex relative top-7 text-md",
                        path.includes('wallet') && '',
                        !path.includes('wallet') && ''
                    )}>
                        <h3 className="lg:text-lg">{showSensitive && accounts && accounts.length>0 ? (type==='up'?accounts[0].total_income:accounts[0].total_expense) : '*****'}</h3>
                        {/* <h5 className="flex lg:text-lg">{type==='up'? 'Income':'Expense'}</h5> */}
                    </div>
                </div>
            </div>
        
           
        )
    }

// }

    return(
        <>
            {
                loading
                ?
                <WalletSkeleton skeleton={true} parentClass={parentClass}/>
                : accounts ?
                <div className={clsx("w-auto flex flex-col rounded-xl p-5 shadow-xl relative border-1 focus:outline-none focus:ring-2 ", 
                    parentClass, transitionClass, 
                    path.includes('wallet') && 'h-auto mb-3',
                    !path.includes('wallet') && 'h-full')}>
                    <div>
                        <h3 className="text-xl w-auto h-auto font-bold text-center">Wallet</h3>
                    </div>
                        {/*Amount section  */}
                    <div>
                        <h1 className="text-center h-10 text-lg lg:text-3xl relative top-5">{showSensitive?`${getCurrencySymbol(accounts[0]?.currency_code)} ${accounts[0]?.remaining_balance}`:'*****'}</h1>
                    </div>
                        {/* income and expense section */}
                    <div className="flex justify-center h-15 text-center">
                        <ArrowFunction type='up'/> {/**  */}
                        <ArrowFunction type='down'/>
                    </div>
                    <button
                        onClick={toggleVisibility}
                        className="absolute bottom-4 right-4 bg-gray-400/20 text-indigo-600 rounded-full p-2"
                        >
                        {showSensitive ? (
                        <EyeIcon className="lg:w-5 w-3 h-3 lg:h-5" />
                        ) : (
                        <EyeSlashIcon className="lg:w-5 w-3 h-3 lg:h-5" />
                        )}
                    </button>
                </div>
                :<WalletSkeleton parentClass={parentClass} skeleton={false}/>
            }
        </>
    )
}