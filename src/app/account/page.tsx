import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
// import CardWrapper from "@/src/components/cards/cardDetails";
import CreditCard from "@/src/components/cards/creditCards";

export default function Page(){
    const pageClass = 'top-5';
    const transitionClass='transition-all ease-in-out duration-500';

    return(
       
        //  <div className="flex bg-red-500 w-full relative items-center justify-center">
           <AuthGuard>
                <CreditCard transitionClass={transitionClass} parentClass={pageClass}/>
           </AuthGuard> 
        // {/* </div> */}
       
        
    )
}