'use client'
import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";
// import CardWrapper from "@/src/components/cards/cardDetails";
// import TransactionCard from "@/src/components/cards/transactionCard";

export default function Page(){
    

    return(
           <AuthGuard>
                {/* <CardWrapper title={'Transactions'}/> */}
                {/* In your Page.tsx grid */}
                {/* <div className=" "> */}
                    <CardWrapper title="Transactions" />
                {/* </div> */}

           </AuthGuard> 
    )
}