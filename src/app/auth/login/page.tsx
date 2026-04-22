import LoginSkeleton from "@/src/components/auth/loginSkeleton";
import LoginFormWrapper from "@/src/components/auth/loginFOrmWrapper";
import { Suspense } from "react";
import GuestGuard from "@/src/components/auth/Guards/GuestGuard";

const Login = async()=>{
    return (
        <GuestGuard>
            <div className="flex justify-center w-full mt-10 mb-10 max-h-[90vh]">
              <div className="relative w-full max-w-sm">
                    <Suspense fallback={<LoginSkeleton />}>
                    <LoginFormWrapper />
                    </Suspense>
                </div>
            </div>
        </GuestGuard>
    )
}

export default Login;

// 'use client';

// import { useEffect } from "react";
// import { useAuthModal } from "@/src/context/authModalContext";

// export default function LoginPage() {
//   const { openModal } = useAuthModal();

//   useEffect(() => {
//     openModal("login");
//   }, []);

//   return null;
// }