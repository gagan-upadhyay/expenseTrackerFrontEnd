import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import AccountDetailsCard from "@/src/components/cards/AccountsDetailsCard";


export default function Page(){
    const pageClass = 'top-5';
    

    return(
       
         
           <AuthGuard>
            {/* <div className="flex w-full overflow-y-auto relative items-center justify-center"> */}
                <AccountDetailsCard parentClass={pageClass}/>
            {/* </div> */}
           </AuthGuard> 
        
       
        
    )
}