'use client';

import { useAuth } from "@/src/context/authContext";
import { useTheme } from "@/src/context/themeContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BounceLoader } from "react-spinners";

export default function AuthGuard({children}:{children:React.ReactNode}){
    const {isLoggedIn, isReady} = useAuth();
    const {theme} =useTheme()
    const pathname = usePathname();
    // console.log('Value of isLoggedIn and isReady from authGurad:\n', isLoggedIn, isReady);
    const router = useRouter();
    useEffect(()=>{
        if(isReady && !isLoggedIn) 
        {
            router.push('/auth/login');
        }
    }, [isLoggedIn, router, isReady, pathname]);

    if (!isReady) {
        return (
        <div className="text-center text-blue-500 flex flex-col items-center justify-center mt-50">
            Checking Authentication...
            <BounceLoader className='relative top-10' size={70} color={theme === 'dark' ? '#0F172B' : '#779dffff'} speedMultiplier={2} />
        </div>
        );
    }
    if(!isLoggedIn || !isReady) 
        return 
        <div className="text-center text-blue-500 flex flex-col items-center justify-center  mt-50">
            Loggin Out..
        <BounceLoader className='relative top-10'  size={70}  color={theme ==='dark' ?'#0F172B':'#779dffff'} speedMultiplier={2}/>
    </div>
    
    return <>{children}</>
}
