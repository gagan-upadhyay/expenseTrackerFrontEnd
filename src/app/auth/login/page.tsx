import LoginSkeleton from "@/src/components/auth/loginSkeleton";
import LoginFormWrapper from "@/src/components/auth/loginFOrmWrapper";
import { Suspense } from "react";
import GuestGuard from "@/src/components/GuestGuard";

const Login = async()=>{
    return (
        <GuestGuard>
            <main className="flex justify-center bg-gray-300 min-h-screen items-center">
                <div className="relative md:mx-auto md:left-1 left-6  flex flex-col w-full p-4 md:mt-10 max-w-[400px] md:space-y-2.5 mt-4">
                    <Suspense fallback={<LoginSkeleton/>}>
                        <LoginFormWrapper/>
                    </Suspense>
                </div>
            </main>
        </GuestGuard>
    )
}

export default Login;