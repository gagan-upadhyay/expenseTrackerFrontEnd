'use client';
// import { UsersIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useRef, useState } from "react";
// import {AtSymbolIcon, KeyIcon} from '@heroicons/react/24/outline'
// import { Button } from "../ui/buttons/buttons";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/context/authContext";
import {jwtDecode} from 'jwt-decode'
import { toastShowError, toastShowSuccess } from "@/src/utils/toastUtils";
import clsx from "clsx";
import { getPasswordStrength } from "@/src/utils/passwordStrength";


export default function RegisterForm(){
    const nameRef = useRef<HTMLInputElement>(null);
    const AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_SERVICE;
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const router = useRouter();
    
    const strength = getPasswordStrength(password);

    const {accessToken, setAccessToken} = useAuth();

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
                toastShowSuccess("User Registered successfully", Number(500));
                router.replace('/dashboard');
            }else{
                toast.error(data.error.message|| "Something broke down, Try again later!");
                toastShowError(data.error.message|| "Something broke down, Try again later!", Number(500));
            }
        }catch(err){
            toast.error("Something went Wrong!!");
            console.log('Error at register phase on client side:\n', err);
        }
    }

    return(
        
        // <form onSubmit={handleRegister} className="w-full px-6 transition-all ease-in-out duration-400 pt-8 bg-gray-50 rounded-lg mb-30 max-w-xs md:max-w-sm">
        //     <h1 className="md:text-2xl text-lg text-gray-400 font-bold mb-4">
        //         Register Here!
        //     </h1>
        //     <div className="flex-1">
        //         <div className=" transition-all ease-in-out duration-700">
        //             <label htmlFor="firstName" className="md:block hidden text-sm font-medium text-gray-700">First Name</label>
        //             <input type="text" ref={nameRef} id="firstName" placeholder="Enter First Name" required onChange={(e)=>setFirstName(e.target.value)} className=" peer py-[9px] placeholder:text-gray-500 pl-10 text-sm mt-1 block w-full px-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:shadow-xl focus:ring-blue-500 text-black sm:text-sm"/>
        //             <UsersIcon className="pointer-events-none text-gray-500 relative top-[-27] ml-2 h-[18px] w-[18px] "/>
        //         </div>

        //         <div className="">
        //             <label htmlFor="firstName" className="md:block hidden text-sm font-medium text-gray-700">Last Name</label>
        //             <input type="text"  id="lastName" placeholder="Enter Last Name" required onChange={(e)=>setLastName(e.target.value)} className=" peer py-[9px] placeholder:text-gray-500 pl-10 text-sm mt-1 block w-full px-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:shadow-xl focus:ring-blue-500 text-black sm:text-sm"/>
        //             <UsersIcon className="pointer-events-none text-gray-500 relative top-[-27] ml-2 h-[18px] w-[18px] "/>
        //         </div>
        //         <div className=''>
        //             <label htmlFor="email" className=" md:block hidden text-sm font-medium text-gray-700">Email</label>
        //             <input type="email" onChange={(e)=>setEmail(e.target.value)} id="email" placeholder='Enter Email' name="email" required className=" peer py-[9px] placeholder:text-gray-500 pl-10 text-sm mt-1 block w-full px-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:shadow-xl focus:ring-blue-500 text-black sm:text-sm" />
        //             <AtSymbolIcon className="pointer-events-none text-gray-500 relative top-[-27] ml-2 h-[18px] w-[18px]"/>
        //         </div>
        //         <div className=''>
        //             <label htmlFor="password" className="md:block hidden text-sm font-medium text-gray-700">Password</label>

        //             <input type="password"
        //             id="password" 
        //             name="password" 
        //             placeholder="Enter password" 
        //             required 
        //             minLength={8}
        //             className="mt-1 w-full border px-3 py-2 border-gray-300 focus:shadow-xl rounded-md shadow-md text-black pl-10 focus:outline-none text-sm placeholder:text-gray-500"
        //             onChange={(e)=>setPassword(e.target.value)}
        //             />
        //             <KeyIcon className=" pointer-events-none mr-3 h-[18px] w-[18px] relative top-[-27] text-gray-500 ml-3"/>
        //         </div>
        //         <div>
        //             <Button href='' className="relative left-48 p-3 md:left-59">Register</Button>
        //         </div>
        //         <ToastContainer/>
        //         <div>
        //             <p className="text-gray-500 text-xs md:text-sm relative top-[-44] md:top-[-39]">Already Registered? <Link className="text-blue-400" href={'/auth/login'}>Login here</Link></p>
        //         </div>
        //     </div>
        // </form>

        <form
            onSubmit={handleRegister}
            className="glass glass-hover relative w-full px-6 py-8 rounded-2xl"
            >
            {/* Glow */}
            <div className="glow glow-indigo -top-10 -right-10"></div>
            <div className="glow glow-purple -bottom-10 -left-10"></div>

            <h1 className="text-xl md:text-2xl font-bold text-center opacity-80 mb-6">
                Register
            </h1>

            <div className="flex flex-col gap-4">

                <input
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                className="glass px-3 py-2 rounded-xl text-sm"
                />

                <input
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                className="glass px-3 py-2 rounded-xl text-sm"
                />

                <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="glass px-3 py-2 rounded-xl text-sm"
                />

                <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="glass px-3 py-2 rounded-xl text-sm"
                />
                {password && (
                    <div className="mt-1">
                        
                        {/* Bar */}
                        <div className="w-full h-2 rounded-full glass-light overflow-hidden">
                        <div
                            className={clsx(
                            "h-full transition-all duration-500",
                            strength.color
                            )}
                            style={{ width: strength.width }}
                        />
                        </div>

                        {/* Label */}
                        <p className="text-xs mt-1 opacity-70">
                        Strength: {strength.label}
                        </p>
                    </div>
                    )}

                <button className="glass-hover py-2 rounded-xl text-sm font-medium">
                Register
                </button>

                <p className="text-xs text-center opacity-70">
                Already registered?{" "}
                <Link href="/auth/login">Login</Link>
                </p>
            </div>
            <ToastContainer />
            </form>
    )
}