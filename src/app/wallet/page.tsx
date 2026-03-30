import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";
// import TransactionCard from "@/src/components/cards/transactionCard";

export default function Page(){
    return(
         <div className=" w-full relative items-center justify-center">
           <AuthGuard>
                <CardWrapper title='Wallet'/>
                <CardWrapper title="Transactions"/>
           </AuthGuard> 
        </div>
       
        
    )
}