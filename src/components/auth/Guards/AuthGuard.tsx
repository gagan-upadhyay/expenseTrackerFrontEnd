'use client';

import { useAuth } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { SyncLoader} from 'react-spinners'

export default function AuthGuard({children}:{children:React.ReactNode}){
    const {isLoggedIn, isReady} = useAuth();
    const router = useRouter();
    

    useEffect(()=>{
        if(isReady && !isLoggedIn) 
            {
                router.replace('/auth/login');
            }
        

    }, [isLoggedIn, router, isReady]);
    console.log("value of isLoggedIn", isLoggedIn);
    if(!isLoggedIn || !isReady) 
        return <p>Loading...</p> ;
    
    return <>{children}</>
}