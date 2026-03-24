import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";
// import TransactionCard from "@/src/components/cards/transactionCard";

export default function Page(){
    const pageClass = 'top-5';

    return(
       
         <div className=" w-full relative items-center justify-center">
           <AuthGuard>
                <CardWrapper pageClass={pageClass} title='Wallet'/>
                <CardWrapper pageClass={pageClass} title="Transactions"/>
           </AuthGuard> 
        </div>
       
        
    )
}