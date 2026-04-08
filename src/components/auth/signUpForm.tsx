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


export default function RegisterForm(){
    const nameRef = useRef<HTMLInputElement>(null);
    const AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_SERVICE;
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [success, setSuccess] = useState<boolean|null>(null);
    const [error, setError] = useState<string|null>(null);

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

    return(
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
                {error?<p className="text-xs text-red-400">{error}</p>:success?<p className="text-xs text-green-400">Successfully registered!</p>:''}
                <button className="glass-hover py-2 rounded-xl text-sm font-medium">
                Register
                </button>

                <p className="text-xs text-center opacity-70">
                Already registered?{" "}
                <Link href="/auth/login">Login</Link>
                </p>
            </div>
            </form>
    )
}