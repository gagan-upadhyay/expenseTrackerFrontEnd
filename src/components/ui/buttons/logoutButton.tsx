'use client'
import { useAuth } from "@/src/context/authContext";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import {useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { toastShowLoading, toastShowSuccess } from "@/src/utils/toastUtils";
import { logoutUser } from "@/src/services/authService";
import getLogger from "@/src/services/logger-service";
import clsx from "clsx";

interface ButtonProps{
    className?: string;
}

export default function LogoutButton({className}: ButtonProps){
    const {isLoggedIn, logout} = useAuth();
    const router = useRouter();

    const handleLogout = async()=>{
        try{
            const response:{success:boolean, message:string} = await logoutUser() as {success:boolean, message:string};

            if(response.success){
                logout(); //frontend state + cookies
                router.replace('/');
            }
        } catch (err) {
            const logger = getLogger('logoutButton');
            logger.error('Error during logout', err);
        }
    }

    return(
        <>
            <button 
                onClick={()=>{
                    const toastID = toastShowLoading('Logging Out...');
                    if(isLoggedIn){
                        setTimeout(()=>{
                            handleLogout();
                            toastShowSuccess("Logged out Successfully", Number(600), String(toastID));
                        }, 600);
                    }else{
                        router.replace('/auth/login')
                    }
                }}
                className={clsx(
                    "flex items-center gap-2 transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded",
                    className
                )}
                aria-label="Logout from account"
                type="button"
            >
                <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Logout</span>
            </button>
            <ToastContainer/>
        </>
    )
}