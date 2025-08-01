'use client';
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "../buttons";
import {AtSymbolIcon, KeyIcon} from '@heroicons/react/24/outline'
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import Link from "next/link";



export default function LoginForm(){
    const emailRef = useRef<HTMLInputElement>(null);
    // const passwordRef = useRef(null);
    
    // const welcomeToDashboard=()=>toast(`Welcome ${email} to the App!`);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();

    useEffect(()=>{
        if (emailRef.current) {
            emailRef.current.focus();
        }
    },[])
    const handleGoogleLoginSuccess = async(credentialResponse: CredentialResponse)=>{
        if(!credentialResponse.credential){
            alert("No credentials received!!!");
            console.log("No creds received");
            return;
        }
        try{
            const response = await fetch('http://localhost:5000/api/v1/auth/login/OAuth', {
                method:"POST",
                headers:
                {
                    // "Content-Type":"application/json",
                    "Authorization": `Bearer ${credentialResponse.credential}`
                    
                },
                // body:JSON.stringify({token:credentialResponse.credential}),
            });
            const data = await response.json();
            if(response.ok){
                console.log('Google login success', data);
                console.log(data);
                
                router.push('/dashboard');
            }else{
                
                alert(data.message || 'OAuth login failed');
            }
        }catch(err){
            console.error("OAuth login error:", err);
        }
    }
    const handleLogin=async(e:React.FormEvent)=>{
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:5000/api/v1/auth/login',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({email, password}),
            });
            const data = await response.json();
            if(response.ok){
                toast.success('Login Successful', {
                    position:'top-right',
                    autoClose:300,
                    theme:'colored'
                })
                console.log('Login Successful:', data);
                router.push('/dashboard');
                
            }
            else{
                toast.error(data.message||"Login failed, Try again later")
                router.push('/auth/register');
                
            }
        }catch(err){
            toast.error("Something went wrong!!")
            console.error('Error during login:', err);
        }
    }
    return (
            <form onSubmit={handleLogin} className="w-full px-6 pb-4 pt-8 bg-gray-50/70 md:bg-gray-50 rounded-lg mb-30 max-w-xs md:max-w-sm">
                <h1 className="text-2xl text-gray-400 font-bold mb-4">
                    Login
                </h1>
                <div className="flex-1 ">                
                
                    <div className="mb-4">
                        <label htmlFor="email" className=" block text-sm font-medium text-gray-700">Email</label>

                        <input type="email" onChange={(e)=>setEmail(e.target.value)} ref={emailRef} id="email" placeholder='Enter Email' name="email" required className=" peer py-[9px] placeholder:text-gray-500 pl-10 text-sm mt-1 block w-full px-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:shadow-xl focus:ring-blue-500 text-black sm:text-sm" />
                        <AtSymbolIcon className="pointer-events-none text-gray-500 absolute top-33 ml-2 h-[18px] w-[18px]"/>
                    </div>
                    <div className="mb-20">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        
                        <input type="password" onChange={(e)=>setPassword(e.target.value)} id="password" name="password" placeholder="Enter password" required className=" mt-1 block w-full border px-3 py-2 border-gray-300 focus:shadow-xl rounded-md shadow-md text-black pl-10 focus:outline-none sm:text-sm placeholder:text-gray-500" />
                        <KeyIcon className=" pointer-events-none mr-3 h-[18px] w-[18px] absolute top-52 text-gray-500 ml-3"/>
                    </div>
                    <Button className="absolute left-66 top-63" href=''>Submit</Button>
                    <ToastContainer/>
                    <div>
                    <p className="text-gray-500 text-xs absolute top-63">Not Registered? <Link className="text-blue-400" href={'/auth/register'}>Register here</Link></p>
                </div>
                    <div className="mt-10" >
                        <GoogleLogin onSuccess={handleGoogleLoginSuccess}
                        onError ={()=>console.log('Google login Failed miserably')} />
                    </div>
                <div>
                </div>
            </div>
            
        </form>   
    )
}