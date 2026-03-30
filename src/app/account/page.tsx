import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import AccountDetailsCard from "@/src/components/cards/AccountDetailsCard";
// import { Suspense } from "react";
// import CardWrapper from "@/src/components/cards/cardDetails";
// import CreditCard from "@/src/components/cards/creditCards";

export default function Page(){
    const pageClass = 'top-5';
    

    return(
       
        //  <div className="flex bg-red-500 w-full relative items-center justify-center">
           <AuthGuard>
            {/* <Suspense fallback={}> */}
                <AccountDetailsCard parentClass={pageClass}/>
                {/* </Suspense> */}
           </AuthGuard> 
        // {/* </div> */}
       
        
    )
}