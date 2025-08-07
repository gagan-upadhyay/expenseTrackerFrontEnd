'use client';
import { UsersIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useRef, useState } from "react";
import {AtSymbolIcon, KeyIcon} from '@heroicons/react/24/outline'
import { Button } from "../buttons";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/authContext";
import {jwtDecode} from 'jwt-decode'


export default function RegisterForm(){
    const nameRef = useRef<HTMLInputElement>(null);

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const router = useRouter();

    const {accessToken, setAccessToken} = useAuth();

    useEffect(() => {
        if (typeof window !== 'undefined') {
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
            if (token && !accessToken) {
                setAccessToken(token);
            }
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
            const response = await fetch(`http://localhost:5000/api/v1/auth/register`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({firstName, lastName, email, password})
            });
            const data = await response.json();
            console.log('Value of Data after register event:\n', data)
            if(response.ok){
                console.log("Value of data from signup form:", data)
                if(data.accessToken){
                    setAccessToken(data.accessToken);
                    document.cookie=(`accessToken=${data.accessToken}; path=/;`);
                }
                if(data.refreshToken){
                    document.cookie=(`refreshToken=${data.refreshToken};path=/;`);
                }
                toast.success("User Registered successfully",{
                    position:'top-right',
                    autoClose:300,
                    theme:'colored'
                });
                console.log("Value of data from client side at register phase:\n",data);
                router.push('/auth/login')
            }else{
                toast.error(data.error.message|| "Something broke down, Try again later!");
            }
        }catch(err){
            toast.error("Something went Wrong!!");
            console.log('Error at register phase on client side:\n', err);
        }
    }

    return(
        <form onSubmit={handleRegister} className="absolute w-screen top-25 px-6 pb-4 pt-8 bg-gray-50/70 md:bg-gray-50 rounded-lg max-w-xs md:max-w-sm">
            <h1 className="text-2xl text-gray-400 font-bold mb-4">
                Register Here!
            </h1>
            <div className="flex flex-col">
                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" ref={nameRef} id="firstName" placeholder="Enter First Name" required onChange={(e)=>setFirstName(e.target.value)} className=" peer py-[9px] placeholder:text-gray-500 pl-10 text-sm mt-1 block w-full px-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:shadow-xl focus:ring-blue-500 text-black sm:text-sm"/>
                    <UsersIcon className="pointer-events-none text-gray-500 absolute top-29 ml-2 h-[18px] w-[18px] "/>
                </div>

                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text"  id="lastName" placeholder="Enter Last Name" required onChange={(e)=>setLastName(e.target.value)} className=" peer py-[9px] placeholder:text-gray-500 pl-10 text-sm mt-1 block w-full px-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:shadow-xl focus:ring-blue-500 text-black sm:text-sm"/>
                    <UsersIcon className="pointer-events-none text-gray-500 absolute top-49 ml-2 h-[18px] w-[18px] "/>
                </div>
                <div className='mb-4'>
                    <label htmlFor="email" className=" block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" onChange={(e)=>setEmail(e.target.value)} id="email" placeholder='Enter Email' name="email" required className=" peer py-[9px] placeholder:text-gray-500 pl-10 text-sm mt-1 block w-full px-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:shadow-xl focus:ring-blue-500 text-black sm:text-sm" />
                    <AtSymbolIcon className="pointer-events-none text-gray-500 absolute top-69 ml-2 h-[18px] w-[18px]"/>
                </div>
                <div className='mb-14'>
                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" onChange={(e)=>setPassword(e.target.value)} id="password" name="password" placeholder="Enter password" required className=" mt-1 block w-full border px-3 py-2 border-gray-300 focus:shadow-xl rounded-md shadow-md text-black pl-10 focus:outline-none sm:text-sm placeholder:text-gray-500" />
                    <KeyIcon className=" pointer-events-none mr-3 h-[18px] w-[18px] absolute top-88 text-gray-500 ml-3"/>
                </div>
                <div>
                    <Button className="absolute top-97 mt-2 left-54 md:left-70" href="">Register</Button>
                </div>
                <ToastContainer/>
                <div>
                    <p className="text-gray-500 text-xs absolute top-98">Already Registered? <Link className="text-blue-400" href={'/auth/login'}>Login here</Link></p>
                </div>
            </div>
        </form>
    )
}