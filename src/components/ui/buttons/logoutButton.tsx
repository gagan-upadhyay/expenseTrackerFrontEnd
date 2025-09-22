'use client'
import { useAuth } from "@/src/context/authContext";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import {useRouter } from "next/navigation";
import {logoutUser} from '../../../services/authService'
import { ToastContainer } from "react-toastify";
import { toastShowLoading, toastShowSuccess } from "@/src/utils/toastUtils";

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
            const result = await logoutUser(); //backend call
            // setTimeout(()=>router.replace('/'), 300);
            console.log(result);
            if(result.ok){
                logout(); //frontend state + cookies
                router.replace('/');
            }

        }catch(err){
            if(err instanceof Error) console.log("Error found in logout Server side:\n", err.stack);
        }
    }
    return(
        <div className={inheritClass} onClick={()=>{
                if(isLoggedIn){
                    toastShowLoading('Logging Out', Number(600));
                    setTimeout(()=>{
                        handleLogout();
                        toastShowSuccess("Logged out Successfully", Number(600));
                    }, 6000);
                    
                }else{
                    
                    router.replace('/auth/login')
                }
            }}>
            <ArrowRightEndOnRectangleIcon className="md:w-5 w-7"/>
            <button className="cursor-pointer" > <p className="hidden text-sm md:text-md md:block">logout</p>
            </button>
            <ToastContainer/>
        </div>
    )
}