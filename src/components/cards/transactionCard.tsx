'use client'
import { useTransactions } from "@/src/context/transactionContext";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import TransacationSkeleton from "../skeletons/transactionSkeleton";
import { usePathname } from "next/navigation";
import { GrTransaction } from "react-icons/gr";
import { Button } from "../ui/buttons/buttons";
import { useTheme } from "@/src/context/themeContext";
import { convertToMMYY } from "@/src/utils/timeConverter";

interface TransactionCardProps{
    pageClass:string;
    transitionClass?:string;
}

export default function TransactionCard({pageClass, transitionClass = ''}:TransactionCardProps){
    // console.log("Value of parentClass form transitionCard:", pageClass);
    const {transactions, errorMsg, loading} = useTransactions();
    console.log('Value of transactions, errorMsg and loading from transactionCard:\n', transactions, errorMsg);
    const path = usePathname();
    const {theme}=useTheme();
    // const walletPage = path.includes('wallet');
    if(!loading){
        console.log('value of transactions after loading is done:', transactions?.length===0);
    }
    
    const transactionPage=path.includes('transactions');
    const dashboardPage = path.includes('dashboard');
    // const walletPage = path.includes('wallet');
    return(
        <>
        {/* PrefixMin Widthsm:640pxmd:768pxlg:1024pxxl:1280px2xl:1536px */}
        {
            loading
            ?
            <TransacationSkeleton pageClass={pageClass} skeleton={true}/>
            : transactions?.length===0 
            ? 
            <TransacationSkeleton skeleton={false} pageClass={pageClass}/>
            :
            <div className={clsx("rounded-xl shadow-xl focus:outline-none focus:ring-2",
                !transactionPage && 'border-1', 
                !dashboardPage && 'p-2 mt-10',
                // walletPage && 'mt-10',
                pageClass, transitionClass,
                )}>
                <div className={clsx(
                    'flex rounded-lg',
                    theme==='dark'?"bg-gray-100/10":"bg-gray-300/40"
                )}>
                    <div className={clsx("flex w-full p-4",
                        transactionPage?"justify-between":"justify-center"
                    )}>
                        <div className="flex gap-2 "> {/**div for icon and transactiuon */}
                            {transactionPage && 
                                <GrTransaction className="
                                border w-8 h-8 mx-2 rounded-xl p-1.5 mt-1"/>
                            }
                            <div className="flex flex-col ">
                                <h3 className="text-xl leading-tight font-bold"><u>Transactions</u></h3>
                                {transactionPage && <h4 className="md:block hidden text-sm text-gray-600 max-w-auto">
                                    Track and view all transactions your transactions with clear and detailed view</h4>}
                            </div>
                        </div>
                        {
                            transactionPage && 
                            <Button href='/' className={clsx("text-lg md:px-5 md:py-3 md:text-sm md:text-base px-7 py-1 mt-1 whitespace-nowrap ",
                                
                            )}> 
                                <span className="lg:hidden">
                                    +
                                </span>
                                <span className="hidden lg:inline">
                                    Add Transactions
                                </span>
                            </Button>
                        }
                        
                    </div>

                </div>
                {
                    !loading && !errorMsg && transactions?.length!==0 &&
                    <div className="flex flex-col bg-gray-400/5 justify-center mt-3">
                        <ul className="divide-y divide-gray-600">
                            {
                                transactions?.map((transaction, index)=>(
                                    <li key={transaction.id||index} className="flex justify-between mb-2 px-2 py-2">
                                        {/* <div > */}
                                            
                                            <>
                                            <div className={clsx("flex items-center ml-1 p-1 border-1 rounded-3xl justify-center",
                                                transaction.type==='credit' && 'bg-green-400/70',
                                                transaction.type==='debit'  && 'bg-red-400/50',

                                            )}>
                                                {transaction.type==='credit'?<ArrowTrendingUpIcon className="h-5 w-5 md:m-[1]"/>:<ArrowTrendingDownIcon className="h-5 w-5 md:m-[1]"/>}
                                            </div>
                                            <div className="sm:text-md lg:text-[14px] md:text-xs md:ml-2 md:mr-2 md:whitespace-nowrap">
                                                <p className={clsx(
                                                    ''
                                                )}>{transaction.display_name.length>7?transaction.display_name.slice(0,7)+'..':transaction.display_name}</p>
                                            </div>
                                            <div className="sm:text-md text-sm lg:text-md md:text-[13px]">
                                                {convertToMMYY(transaction.occurred_at)}
                                            </div>
                                            <div className="sm:text-md lg:text-md md:text-[13px]">
                                                {getCurrencySymbol(transaction.currency_code)}{transaction.amount}
                                            </div>
                                            </>
                                        {/* </div> */}
                                    </li>
                                ))
                            }
                            
                        </ul>
                    </div>
                }      
            </div>
            
            
        }
        </>
    )
}