'use client'
import { useAuth } from "@/src/context/authContext";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import {useRouter } from "next/navigation";
// import {logoutUser} from '../../../services/authService'
import { ToastContainer } from "react-toastify";
import { toastShowLoading, toastShowSuccess } from "@/src/utils/toastUtils";
import { logoutUser } from "@/src/services/authService";
import getLogger from "@/src/services/logger-service";

interface buttonProp{
    isClass?:string | null;
}

export default function LogoutButton({isClass}:buttonProp){
    // const pathname = usePathname();
    const {isLoggedIn, logout} = useAuth();
    const router = useRouter();
    const inheritClass = isClass ? isClass: ""

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
        <div className={inheritClass} onClick={()=>{
            const toastID = toastShowLoading('Logging Out...');
                if(isLoggedIn){
                    
                    setTimeout(()=>{
                        handleLogout();
                        toastShowSuccess("Logged out Successfully", Number(600), String(toastID));
                    }, 6000);
                    
                }else{
                    router.replace('/auth/login')
                }
            }}>
            <ArrowRightEndOnRectangleIcon className="sm:w-5 w-7"/>
            <ToastContainer/>
        </div>
    )
}