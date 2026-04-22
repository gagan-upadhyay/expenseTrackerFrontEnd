// 'use client';
// import { useRouter } from "next/navigation";
// import { useState, useRef, useEffect } from "react";
// // import { ToastContainer} from "react-toastify";
// // import { Button } from "../ui/buttons/buttons";
// import {AtSymbolIcon, EyeIcon, EyeSlashIcon, KeyIcon} from '@heroicons/react/24/outline'
// import { GoogleLogin } from "@react-oauth/google";
// import Link from "next/link";
// import { useAuth } from "@/src/context/authContext";
// import { useGoogleOauthHandler } from "@/src/Hooks/authHooks/useGoogleAuthHandler";
// import { loginWithEmail } from "@/src/services/authService";
// import { toastShowError, toastShowSuccess } from "@/src/utils/toastUtils";
// import clsx from "clsx";
// // import { FcGoogle } from "react-icons/fc";
// // import { useEffect, useRef } from "react";
// import { gsap } from "gsap";




// export default function LoginForm(){
//     const emailRef = useRef<HTMLInputElement>(null);
//     const {handleGoogleLoginSuccess} = useGoogleOauthHandler();
//     const [email, setEmail] = useState<string>('');
//     const [password, setPassword] = useState<string>('');
//     const router = useRouter();
//     const {setAccessToken, setIsLoggedIn, logout} = useAuth();
//     const [loading, setLoading] = useState<boolean>(false);
//     const [eyeOpen, setEyeOpen] = useState<boolean>(false);
//     const [errors, setErrors] = useState<string|null>(null);

//     useEffect(()=>{

//         if (emailRef.current) {
//             emailRef.current.focus();
//         }
//     },[]);
//     const formRef = useRef<HTMLFormElement>(null);

//     useEffect(() => {
//     if (!formRef.current) return;

//     gsap.fromTo(
//         formRef.current,
//         { opacity: 0, y: 40, scale: 0.95 },
//         {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         duration: 0.6,
//         ease: "power3.out",
//         }
//     );
//     }, []);

//     const toggleEyeOpen = ()=>{
//         setEyeOpen(!eyeOpen);
//     }

//     // const resetValues = (key: keyof USER)=>{
//     //     if(key==='password'){
//     //         setPassword('');
//     //     }
//     // }

//     const handleLogin=async(e:React.FormEvent)=>{
//         e.preventDefault();
//         logout();
//         if(loading) return;
//         setLoading(true);
//         try{
//             const data:{success:boolean, message:string|null, error:string|null, accessToken:string|null, refreshToken:string|null} = await loginWithEmail(email, password) as {success:boolean, message:string, error:string|null, accessToken:string|null, refreshToken:string|null};

//             console.log("Value of data from try block:", data);
//             if(data?.error){
//                 setErrors(data?.error);
//             }
//             if(data.accessToken) {
//                 setAccessToken(data.accessToken);
//                 document.cookie=`accessToken=${data.accessToken}; path=/;`;
//             }
//             if(data.refreshToken) document.cookie = `refreshToken=${data.refreshToken}; path=/;`
//             setIsLoggedIn(true);
//             toastShowSuccess('Login Successful', Number(600));
//             router.replace('/dashboard');
//         }
//         catch(e: unknown){
//             let errorMessage="An unexpected Error occurred";
//             if (e instanceof Error){
//                 errorMessage=e.message;
//             }else if(typeof e==='string'){
//                 errorMessage=e;
//             }
//             const htmlMatch = errorMessage.match(/502\s+(Bad Gateway)/i);
//             if (htmlMatch) {
//                 errorMessage = htmlMatch[1]; // Sets errorMessage to exactly "Bad Gateway"
//             }
//             setErrors(errorMessage);
//             console.warn("value of error from loginForm:", errorMessage);
//             toastShowError(errorMessage, Number(1500));
//         }
//         finally{
//             setLoading(false);
//         }
//     }
//     return (  
//         <>
//             <form
//                 onSubmit={handleLogin}
//                 className="glass glass-hover relative w-full px-6 py-8 rounded-2xl transition-all duration-500"
//                 ref={formRef}
//                 >
//                 {/* Glow */}
//                 <div className="glow glow-indigo -top-10 -right-10"></div>
//                 <div className="glow glow-purple -bottom-10 -left-10"></div>

//                 <h1 className="text-xl md:text-2xl font-bold text-center opacity-80 mb-6">
//                     Login
//                 </h1>

//                 <div className="flex flex-col gap-4">

//                     {/* EMAIL */}
//                     <div className="relative">
//                     <input
//                         type="email"
//                         ref={emailRef}
//                         placeholder="Enter Email"
//                         required
//                         onChange={(e) => {
//                         setEmail(e.target.value);
//                         if (errors) setErrors(null);
//                         }}
//                         className={clsx(
//                         "glass px-3 py-2 rounded-xl w-full pl-10 text-sm",
//                         errors && "border-red-400/40 animate-shake"
//                         )}
//                     />
//                     <AtSymbolIcon className="absolute left-3 top-2.5 w-4 h-4 opacity-60" />
//                     </div>

//                     {/* PASSWORD */}
//                     <div className="relative">
//                     <input
//                         type={eyeOpen ? "text" : "password"}
//                         placeholder="Enter password"
//                         required
//                         onChange={(e) => {
//                         setPassword(e.target.value);
//                         if (errors) setErrors(null);
//                         }}
//                         className={clsx(
//                         "glass px-3 py-2 rounded-xl w-full pl-10 text-sm",
//                         errors && "border-red-400/40 animate-shake",
//                         " focus:scale-[1.02] focus:ring-2 focus:ring-indigo-400/40"
//                         )}
//                     />
//                     <KeyIcon className="absolute left-3 top-2.5 w-4 h-4 opacity-60" />

//                     {password && (
//                         <button
//                         onClick={(e) => {
//                             e.preventDefault();
//                             toggleEyeOpen();
//                         }}
//                         className="absolute right-3 top-2.5"
//                         >
//                         {eyeOpen ? (
//                             <EyeIcon className="w-4 h-4 user-events-none opacity-60" />
//                         ) : (
//                             <EyeSlashIcon className="w-4 h-4 user-events-none opacity-60" />
//                         )}
//                         </button>
//                     )}
//                     </div>

//                     {/* ERROR */}
//                     {errors && (
//                     <p className="text-red-400 text-xs ">{errors}</p>
//                     )}

//                     {/* BUTTON */}
//                     <button
//                     disabled={loading}
//                     className="glass-hover py-2 active:scale-95 rounded-xl text-sm font-medium mt-2"
//                     >
//                     {loading ? "Logging in..." : "Login"}
//                     </button>

//                     {/* LINKS */}
//                     <div className="text-xs flex justify-between opacity-70">
//                     <Link href="/auth/register">Register</Link>
//                     <Link href="/auth/forgot-password">Forgot?</Link>
//                     </div>
//                     <div className="flex justify-center  mt-2 ">
//                     <GoogleLogin shape="pill" size="large" type="icon" theme="filled_black" onSuccess={handleGoogleLoginSuccess} />
//                     </div>
//                 </div>
//             </form>
//         </>
//     )
// }

'use client';

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { AtSymbolIcon, EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useAuth } from "@/src/context/authContext";
import { useGoogleOauthHandler } from "@/src/Hooks/authHooks/useGoogleAuthHandler";
import { loginWithEmail } from "@/src/services/authService";
import { toastShowError, toastShowSuccess } from "@/src/utils/toastUtils";
import clsx from "clsx";
import { gsap } from "gsap";

export default function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { handleGoogleLoginSuccess } = useGoogleOauthHandler();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [eyeOpen, setEyeOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<string | null>(null);

  const router = useRouter();
  const { setAccessToken, setIsLoggedIn, logout } = useAuth();

  // Initial Focus & GSAP Animation
  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
    if (!formRef.current) return;

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    logout();
    if (loading) return;
    setLoading(true);

    try {
      const data = await loginWithEmail(email, password) as any;

      if (data?.error) {
        setErrors(data.error);
        return;
      }

      if (data.accessToken) {
        setAccessToken(data.accessToken);
        document.cookie = `accessToken=${data.accessToken}; path=/;`;
      }
      if (data.refreshToken) document.cookie = `refreshToken=${data.refreshToken}; path=/;`;
      
      setIsLoggedIn(true);
      toastShowSuccess('Login Successful', 600);
      router.replace('/dashboard');
    } catch (e: any) {
      let errorMessage = e?.message || "An unexpected error occurred";
      if (errorMessage.includes("502")) errorMessage = "Bad Gateway";
      
      setErrors(errorMessage);
      toastShowError(errorMessage, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      ref={formRef}
      className="glass glass-hover relative w-full px-6 py-10 rounded-2xl border border-white/20 shadow-2xl transition-all duration-500"
    >
      {/* Visual Accents */}
      <div className="glow-indigo -top-12 -right-12 opacity-30" />
      <div className="glow-purple -bottom-12 -left-12 opacity-30" />

      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 tracking-tight">
        Welcome Back
      </h1>

      <div className="flex flex-col gap-5">
        {/* EMAIL INPUT */}
        <div className="relative">
          <input
            type="email"
            ref={emailRef}
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors) setErrors(null);
            }}
            className={clsx(
              "glass px-4 py-3 rounded-2xl w-full pl-12 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-400/40",
              errors && "border-red-400/40 animate-shake"
            )}
          />
          <AtSymbolIcon className="absolute left-4 top-3.5 w-5 h-5 opacity-50" />
        </div>

        {/* PASSWORD INPUT */}
        <div className="relative">
          <input
            type={eyeOpen ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors) setErrors(null);
            }}
            className={clsx(
              "glass px-4 py-3 rounded-2xl w-full pl-12 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-400/40",
              errors && "border-red-400/40 animate-shake"
            )}
          />
          <KeyIcon className="absolute left-4 top-3.5 w-5 h-5 opacity-50" />

          {password && (
            <button
              type="button"
              onClick={() => setEyeOpen(!eyeOpen)}
              className="absolute right-4 top-3.5 hover:opacity-100 transition-opacity opacity-50"
            >
              {eyeOpen ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* ERROR DISPLAY */}
        {errors && (
          <p className="text-red-400 text-xs px-2 font-medium">{errors}</p>
        )}

        {/* LOGIN BUTTON */}
        <button
          disabled={loading}
          className="glass-strong py-3 rounded-2xl text-sm font-bold mt-2 hover:bg-white/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Login"}
        </button>

        {/* AUTH LINKS */}
        <div className="text-xs flex justify-between px-2 mt-2 font-medium">
          <Link href="/auth/register" className="opacity-60 hover:opacity-100 hover:text-blue-400 transition-all">Create Account</Link>
          <Link href="/auth/forgot-password" className="opacity-60 hover:opacity-100 transition-all">Forgot Password?</Link>
        </div>

        {/* SOCIAL LOGIN */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest opacity-40">OR</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="flex justify-center">
          <div className="glass-light p-1 rounded-full overflow-hidden">
            <GoogleLogin 
                shape="pill" 
                theme="filled_black" 
                onSuccess={handleGoogleLoginSuccess} 
            />
          </div>
        </div>
      </div>
    </form>
  );
}
