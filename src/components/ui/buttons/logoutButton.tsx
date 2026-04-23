'use client'
import { useAuth } from "@/src/context/authContext";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import {useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { logoutUser } from "@/src/services/authService";
import getLogger from "@/src/services/logger-service";

interface ButtonProps{
    className?: string;
}

export default function LogoutButton({className}: ButtonProps){
    const {isLoggedIn, logout} = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async()=>{
        try{
            setIsLoggingOut(true);
            const response:{success:boolean, message:string} = await logoutUser() as {success:boolean, message:string};

            if(response.success){
                logout(); //frontend state + cookies
                await new Promise(res => setTimeout(res, 500)); // Brief delay for UI feedback
                router.replace('/');
            }
        } catch (err) {
            const logger = getLogger('logoutButton');
            logger.error('Error during logout', err);
            setIsLoggingOut(false);
        }
    }

    return(
        <button 
            onClick={()=>{
                if(isLoggedIn){
                    handleLogout();
                }else{
                    router.replace('/auth/login')
                }
            }}
            disabled={isLoggingOut}
            className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300",
                "hover:bg-red-50 dark:hover:bg-red-900/20",
                "border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700",
                "bg-white dark:bg-slate-800",
                "shadow-sm hover:shadow-md",
                className
            )}
            aria-label={isLoggingOut ? "Logging out..." : "Logout from account"}
            aria-busy={isLoggingOut}
            type="button"
        >
            {isLoggingOut ? (
                <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="hidden sm:inline text-sm">Logging out...</span>
                </>
            ) : (
                <>
                    <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm">Logout</span>
                </>
            )}
        </button>
    )
}
// }