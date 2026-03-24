import { useTheme } from "@/src/context/themeContext";
import clsx from "clsx";
import { RedirectingButton } from "../ui/buttons/redirectingButton";
// import { usePathname } from "next/navigation";

interface TransactionCardSkeletonProps{
    pageClass:string;
    skeleton:boolean;
}
    // const path = usePathname();
    // const transactionPage=path.includes('transactions');
    // const dashboardPage = path.includes('dashboard');
export default function TransacationSkeleton({pageClass, skeleton}:TransactionCardSkeletonProps ){
    const {theme} = useTheme();
    
    return(
        <div className={clsx("w-auto rounded-xl p-5 shadow-xl relative border-1 focus:outline-none focus:ring-2", 
            'p-2 mt-10',
            pageClass,)}>
            <h3 className="text-xl w-auto h-auto font-bold text-center"></h3>
            {!skeleton && <RedirectingButton theme={theme} target={'/transactions/add-transactions'} title={'transactions'}/>
            }
            <div className={clsx("flex flex-col bg-gray-400/5 mt-3", !skeleton &&theme==='light'? 'opacity-100 bg-dark':'opacity-50','animate-pulse')}>
                
                <ul className="divide-y divide-gray-600">
                    {
                        Array.from({length:6}).map((_,index)=>(
                            <li key={index} className="flex justify-between mb-2 px-2 py-3">
                                {/* Icon placeholder */}
                                <div className="flex items-center justify-center mr-4">
                                    <div className="h-5 w-5 bg-gray-300/40 rounded-full" />
                                </div>
                                {/* Title placeholder */}
                                <div className="flex-1 flex items-center">
                                    <div className="h-4 w-24 bg-gray-300/40 rounded-md" />
                                </div>
                                {/* Amount placeholder */}
                                <div className="flex items-center justify-end">
                                    <div className="h-4 w-12 bg-gray-300/40 rounded-md" />
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )

}