import LoginSkeleton from "@/app/ui/skeletons/loginSkeleton";
import LoginFormWrapper from "@/app/wrappers/auth/loginFormWrapper";
import { Suspense } from "react";

const Login = async()=>{
    return (
       <div className="flex justify-center bg-gray-300 min-h-screen items-center">
                <div className="relative md:mx-auto md:left-1 left-6  flex flex-col w-full p-4 md:mt-10 max-w-[400px] md:space-y-2.5 mt-4">
                    <Suspense fallback={<LoginSkeleton/>}>
                        <LoginFormWrapper/>
                    </Suspense>
                </div>
           </div>
    )
}

export default Login;