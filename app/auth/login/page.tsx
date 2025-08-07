// import LoginForm from "@/app/ui/auth/loginForm";
import LoginSkeleton from "@/app/ui/skeletons/loginSkeleton";
import LoginFormWrapper from "@/app/wrappers/auth/loginFOrmWrapper";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import { Suspense } from "react";

const Login = async()=>{
    // console.log("Value of process.env.GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID)
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