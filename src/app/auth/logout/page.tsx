import LogoutClient from "@/src/components/auth/logout";
import { Suspense } from "react";

export default function Logout(){    
    return(
        <div className="flex h-screen items-center justify-center bg-amber-950">
            <div className=" bg-amber-400">
                <Suspense>
                    <LogoutClient/>
                </Suspense>
            </div>
        </div>
    )
}