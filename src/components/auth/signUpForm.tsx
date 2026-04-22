'use client';
// import { UsersIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useRef, useState } from "react";
// import {AtSymbolIcon, KeyIcon} from '@heroicons/react/24/outline'
// import { Button } from "../ui/buttons/buttons";
// import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/context/authContext";
import {jwtDecode} from 'jwt-decode'
import { toastShowError, toastShowSuccess } from "@/src/utils/toastUtils";
import clsx from "clsx";
import { getPasswordStrength } from "@/src/utils/passwordStrength";
import { gsap } from "gsap";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


export default function RegisterForm(){
  const nameRef = useRef<HTMLInputElement>(null);
  const AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_SERVICE;
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<boolean|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [eyeOpen, setEyeOpen] = useState<boolean>(false);
    
  //refs here
  const firstNameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();
    
  const strength = getPasswordStrength(password);

  const {accessToken, setAccessToken} = useAuth();

  // initial focus and gsap animation
  useEffect(()=>{
    if(firstNameRef.current) firstNameRef.current.focus();
    if(!formRef.current) return;

    gsap.fromTo(
      formRef.current,
      {opacity:0, y:40, scale:0.95},
      {opacity:1, y:0, scale:1, duration:0.6, ease:"power3.out"}
    )
  },[]);

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];
        if(token && !accessToken){
            setAccessToken(token);
            try{
                interface DecodedToken {
                    exp?: number;
                    [key: string]: unknown;
                }
                const decoded: DecodedToken = jwtDecode(token);
                if(decoded.exp && decoded.exp*1000 > Date.now()){
                    router.replace('/')
                }
            }catch(err){console.log(err)}
        }
    }, [accessToken, setAccessToken, router]);

    useEffect(()=>{
        setError(null);
        setSuccess(null);
        if(nameRef.current){
            nameRef.current.focus()
        }
    },[]);

    const handleRegister = async(e:React.FormEvent)=>{
        e.preventDefault();
        try{
            console.log('Register button clicked, target addr:', AUTH_SERVICE);
            const response = await fetch(`${AUTH_SERVICE}/api/v1/auth/register/`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({firstName, lastName, email, password})
            });
            const data = await response.json();
            console.log('Value of Data after register event:\n', data)
            if(data.message==="User already exists"){
                setError('User exists, redirecting to login');
                toastShowError('User already registered, redirecting to login page', Number(1000));
                router.push('/auth/login');
                console.log("Value of data from signup form:", data)
            }else if(data.message==="User registered successfully"){
                console.log("Value of data:\n ", data);
                if(data.accessToken){
                    setAccessToken(data.accessToken);
                    document.cookie=(`accessToken=${data.accessToken}; path=/;`);
                }
                if(data.refreshToken){
                    document.cookie=(`refreshToken=${data.refreshToken};path=/;`);
                }
                setSuccess(true);
                toastShowSuccess("User Registered successfully", Number(500));
                router.replace('/dashboard');
            }else{
                setError('Something went wrong');
                // toast.error(data.error.message|| "Something broke down, Try again later!");
                toastShowError(data.error.message|| "Something broke down, Try again later!", Number(500));
            }
        }catch(err){
            setError('Somthing broke, try again later!');
            // toast.error("Something went Wrong!!");
            console.log('Error at register phase on client side:\n', err);
        }
    }

    // return(
    //     <form
    //         onSubmit={handleRegister}
    //         className="glass glass-hover relative w-full px-6 py-8 rounded-2xl"
    //         >
    //         {/* Glow */}
    //         <div className="glow glow-indigo -top-10 -right-10"></div>
    //         <div className="glow glow-purple -bottom-10 -left-10"></div>

    //         <h1 className="text-xl md:text-2xl font-bold text-center opacity-80 mb-6">
    //             Register
    //         </h1>

    //         <div className="flex flex-col gap-4">

    //             <input
    //             placeholder="First Name"
    //             onChange={(e) => setFirstName(e.target.value)}
    //             className="glass px-3 py-2 rounded-xl text-sm"
    //             />

    //             <input
    //             placeholder="Last Name"
    //             onChange={(e) => setLastName(e.target.value)}
    //             className="glass px-3 py-2 rounded-xl text-sm"
    //             />

    //             <input
    //             type="email"
    //             placeholder="Email"
    //             onChange={(e) => setEmail(e.target.value)}
    //             className="glass px-3 py-2 rounded-xl text-sm"
    //             />

    //             <input
    //             type="password"
    //             placeholder="Password"
    //             onChange={(e) => setPassword(e.target.value)}
    //             className="glass px-3 py-2 rounded-xl text-sm"
    //             />
    //             {password && (
    //                 <div className="mt-1">
                        
    //                     {/* Bar */}
    //                     <div className="w-full h-2 rounded-full glass-light overflow-hidden">
    //                     <div
    //                         className={clsx(
    //                         "h-full transition-all duration-500",
    //                         strength.color
    //                         )}
    //                         style={{ width: strength.width }}
    //                     />
    //                     </div>

    //                     {/* Label */}
    //                     <p className="text-xs mt-1 opacity-70">
    //                     Strength: {strength.label}
    //                     </p>
    //                 </div>
    //                 )}
    //             {error?<p className="text-xs text-red-400">{error}</p>:success?<p className="text-xs text-green-400">Successfully registered!</p>:''}
    //             <button className="glass-hover py-2 rounded-xl text-sm font-medium">
    //             Register
    //             </button>

    //             <p className="text-xs text-center opacity-70">
    //             Already registered?{" "}
    //             <Link href="/auth/login">Login</Link>
    //             </p>
    //         </div>
    //         </form>
    // )

  return (
    // <div className="relative group">
    //   {/* Outer Border Glow */}
    //   {/* <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div> */}
      
      <form
      ref={formRef}
        onSubmit={handleRegister}
        className="glass relative w-full px-8 py-10 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-6 transition-all duration-500"
      >
              {/* Visual Accents */}
      <div className="glow-indigo -top-12 -right-12 opacity-30" />
      <div className="glow-purple -bottom-12 -left-12 opacity-30" />
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white opacity-90">
            Create Account
          </h1>
          <p className="text-[10px] text-indigo-400 font-bold uppercase mt-2 tracking-widest">
            Join the Financial Hub
          </p>
        </div>

        <div className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/30 ml-1">First Name</label>
              <input
                ref={firstNameRef}
                required
                placeholder="John"
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/30 ml-1">Last Name</label>
              <input
                required
                placeholder="Doe"
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-white/30 ml-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-white/30 ml-1">Secure Password</label>
            <input
              type={eyeOpen?"text":"password"}
              required
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
            />
            {password && (
              <button
                type="button"
                onClick={() => setEyeOpen(!eyeOpen)}
                className="absolute right-10 top-81 hover:opacity-100 transition-opacity opacity-50"
              >
                {eyeOpen ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
              </button>
            )}
            {password && (
              <div className="px-1 pt-2">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={clsx("h-full transition-all duration-500", strength.color)} style={{ width: strength.width }} />
                </div>
                <p className="text-[9px] mt-1 font-bold uppercase text-white/40">Security: {strength.label}</p>
              </div>
            )}
          </div>
        </div>

        <button className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-xl active:scale-95">
          Get Started
        </button>

        <p className="text-[10px] text-center font-bold uppercase tracking-widest text-white/30">
          Member already?{" "}
          <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 ml-1 transition-colors">
            Sign In
          </Link>
        </p>
      </form>
    // </div>
  );
// }

}