'use client';

import { useAuth } from "@/src/context/authContext";
import { useTheme } from "@/src/context/themeContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BounceLoader } from "react-spinners";

export default function AuthGuard({children}:{children:React.ReactNode}){
    const {isLoggedIn, isReady} = useAuth();
    const {theme} =useTheme()
    // console.log('Value of isLoggedIn and isReady from authGurad:\n', isLoggedIn, isReady);
    const router = useRouter();
    useEffect(()=>{
        if(isReady && !isLoggedIn) 
        {
            router.replace('/auth/login');
        }
    }, [isLoggedIn, router, isReady]);
    if(!isLoggedIn || !isReady) 
        return 
        <div className="text-center text-blue-500 flex flex-col items-center justify-center  mt-50">
            Loggin Out..
        <BounceLoader className='relative top-10'  size={70}  color={theme ==='dark' ?'#0F172B':'#779dffff'} speedMultiplier={2}/>
    </div>
    
    return <>{children}</>
}