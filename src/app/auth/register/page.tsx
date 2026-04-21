import RegisterFormSkeleton from "@/src/components/auth/registerSkeleton";
import RegisterFormWrapper from "@/src/components/auth/registerFormWrapper";
import { Suspense } from "react"
import GuestGuard from "@/src/components/auth/Guards/GuestGuard";

// const Register = ()=>{
//     return(
//         <GuestGuard>

//             <div className="flex justify-center items-center min-h-screen px-4">
//                 <div className="relative w-full max-w-sm">
//                     <Suspense fallback={<RegisterFormSkeleton />}>
//                         <RegisterFormWrapper />
//                     </Suspense>
//                 </div>
//             </div>
//         </GuestGuard>
//     )
// }

const Register = () => {
  return (
    <GuestGuard>
      <div className="auth-bg auth-grid min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <Suspense fallback={<RegisterFormSkeleton />}>
            <RegisterFormWrapper />
          </Suspense>
        </div>
      </div>
    </GuestGuard>
  );
};


export default Register;

// 'use client';

// import { useEffect } from "react";
// import { useAuthModal } from "@/src/context/authModalContext";

// export default function LoginPage() {
//   const { openModal } = useAuthModal();

//   useEffect(() => {
//     openModal("register");
//   }, []);

//   return null;
// }