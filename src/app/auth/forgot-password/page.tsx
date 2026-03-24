// import LoginSkeleton from "@/src/components/auth/loginSkeleton";
// import LoginFormWrapper from "@/src/components/auth/loginFOrmWrapper";
import { Suspense } from "react";
import GuestGuard from "@/src/components/auth/Guards/GuestGuard";
import ForgotPasswordSkeleton from "@/src/components/auth/forgot-passwordSkeleton";
import ForgotPasswordWrapper from "@/src/components/auth/forgotPasswordWrapper";

const ForgotPassword = async()=>{
    return (
        <GuestGuard>
            <div className="flex justify-center">
                <div className="relative md:mx-auto top-26 md:top-2 flex flex-col w-full p-4 max-w-[400px] transition-all duration-400 ease-in-out ">
                    <Suspense fallback={<ForgotPasswordSkeleton/>}>
                        <ForgotPasswordWrapper/>
                    </Suspense>
                </div>
            </div>
        </GuestGuard>
    )
}

export default ForgotPassword;