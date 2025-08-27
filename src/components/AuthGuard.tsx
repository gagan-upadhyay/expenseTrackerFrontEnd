'use client';

import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({children}:{children:React.ReactNode}){
    const {isLoggedIn, isReady} = useAuth();
    const router = useRouter();

    useEffect(()=>{
        if(isReady && !isLoggedIn) 
            {
                router.replace('auth/login');
            }

    }, [isLoggedIn, isReady, router]);

    if(!isLoggedIn || !isReady) return null; // add a loading spinner
    
    return <>{children}</>
}