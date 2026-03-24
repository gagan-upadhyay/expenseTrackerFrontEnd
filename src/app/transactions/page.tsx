'use client'
import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
// import CardWrapper from "@/src/components/cards/cardDetails";
import TransactionCard from "@/src/components/cards/transactionCard";

export default function Page(){
    const pageClass = '';

    return(
       
        //  <div className="flex bg-red-500 w-full relative items-center justify-center">
           <AuthGuard>
                {/* <CardWrapper pageClass={pageClass} title='Wallet'/> */}
                <TransactionCard pageClass={pageClass}/>
           </AuthGuard> 
        // {/* </div> */}
       
        
    )
}