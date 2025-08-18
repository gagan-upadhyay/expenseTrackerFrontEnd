import { useAuth } from "@/app/context/authContext";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import {useRouter } from "next/navigation";

interface buttonProp{
    isClass?:string | null;
}

export default function LogoutButton({isClass}:buttonProp){
    // const pathname = usePathname();
    const {isLoggedIn} = useAuth();
    const router = useRouter();

    const logout = async()=>{
        try{
            await fetch('http://localhost:5000/api/v1/auth/logout',{
                method:'POST',
                credentials:'include',
            });
            setTimeout(()=>router.replace('/'), 300);
        }catch(err){
            if(err instanceof Error) console.log("Error found in logout Server side:\n", err.stack);
        }
    }
    const inheritClass = isClass ? isClass: ""

    return(
        <div className={inheritClass} onClick={()=>{
                if(isLoggedIn){
                    logout();
                }else{
                    router.replace('/auth/login')
                }
            }}>
            <ArrowRightEndOnRectangleIcon className="md:w-5 w-7"/>
            <button className="cursor-pointer" > <p className="hidden text-sm md:text-md md:block">logout</p>
            </button>
        </div>
    )
}