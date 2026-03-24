import RegisterFormSkeleton from "@/src/components/auth/registerSkeleton";
import RegisterFormWrapper from "@/src/components/auth/registerFormWrapper";
import { Suspense } from "react"
import GuestGuard from "@/src/components/auth/Guards/GuestGuard";

const Register = ()=>{
    return(
        <GuestGuard>
            <div className="flex  bg-gray-300 h-auto">
                <div className="mx-auto flex flex-col w-full p-4 max-w-[400px] ">
                    <Suspense fallback={<RegisterFormSkeleton/>}>
                        <RegisterFormWrapper/>
                    </Suspense>
                </div>
            </div>
        </GuestGuard>
    )
}
export default Register;