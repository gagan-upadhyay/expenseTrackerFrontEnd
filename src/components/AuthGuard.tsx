'use client';

import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SyncLoader} from 'react-spinners'

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
        return <SyncLoader
        color="#ffff12"
        loading={!isReady}
        size={100}
        aria-label="loading-spinner"
        data-testid='loader'
        /> ;
    
    return <>{children}</>
}