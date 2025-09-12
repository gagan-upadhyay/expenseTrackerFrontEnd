'use client';
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { ToastContainer} from "react-toastify";
import { Button } from "../ui/buttons/buttons";
import {AtSymbolIcon, KeyIcon} from '@heroicons/react/24/outline'
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useAuth } from "@/src/context/authContext";
import { useGoogleOauthHandler } from "@/src/Hooks/authHooks/useGoogleAuthHandler";
import { loginWithEmail } from "@/src/services/authService";
import { toastShowError, toastShowSuccess } from "@/src/utils/toastUtils";



export default function LoginForm(){
    const emailRef = useRef<HTMLInputElement>(null);
    const {handleGoogleLoginSuccess} = useGoogleOauthHandler();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();
    const {setAccessToken, setIsLoggedIn, logout} = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{

        if (emailRef.current) {
            emailRef.current.focus();
        }
    },[])
    const handleLogin=async(e:React.FormEvent)=>{
        e.preventDefault();
        logout();
        
        if(loading) return;
        setLoading(true);

        try{
            const data = await loginWithEmail(email, password);    
            if(data.accessToken) {
                setAccessToken(data.accessToken);
                document.cookie=`accessToken=${data.accessToken}; path=/;`;
            }
            if (data.refreshToken) document.cookie = `refreshToken=${data.refreshToken}; path=/;`
            
            setIsLoggedIn(true);
            toastShowSuccess('Login Successful');
            console.log('Login Successful:', data);
            router.replace('/dashboard');
        }catch(err){
            toastShowError("Something went wrong!!")
            console.error('Error during login:', err);
        }finally{
            setLoading(false);
        }
    }
    return (
            <form onSubmit={handleLogin} className="w-full px-6 pb-4 pt-8 bg-gray-50 rounded-lg mb-30 max-w-xs md:max-w-sm">
                <h1 className="text-2xl text-gray-400 font-bold mb-4">
                    Login
                </h1>
                <div className="flex-1 ">                
                
                    <div className="mb-4">
                        <label htmlFor="email" className=" md:block hidden text-sm font-medium text-gray-700">Email</label>

                        <input type="email" onChange={(e)=>setEmail(e.target.value)} ref={emailRef} id="email" placeholder='Enter Email' name="email" required className=" peer py-[9px] placeholder:text-gray-500 pl-10 text-sm mt-1 block w-full px-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:shadow-xl focus:ring-blue-500 text-black sm:text-sm" />
                        <AtSymbolIcon className="pointer-events-none text-gray-500 absolute md:top-33 top-27 ml-2 h-[18px] w-[18px]"/>
                    </div>
                    <div className="mb-20">
                        <label htmlFor="password" className="hidden md:block text-sm font-medium text-gray-700">Password</label>
                        
                        <input type="password" onChange={(e)=>setPassword(e.target.value)} id="password" name="password" placeholder="Enter password" required className=" mt-1 block w-full border px-3 py-2 border-gray-300 focus:shadow-xl rounded-md shadow-md text-black pl-10 focus:outline-none sm:text-sm placeholder:text-gray-500" />
                        <KeyIcon className=" pointer-events-none mr-3 h-[18px] w-[18px] absolute md:top-52 top-41 text-gray-500 ml-3"/>
                    </div>
                    <Button disabled={loading} className='absolute left-12 md:left-66 top-51 md:top-63' href=''>Submit</Button>
                    
                    <div>
                    <p className="text-gray-500 text-xs md:left-10 left-35 absolute top-50 md:top-63">Not Registered? <Link className="text-blue-400" href={'/auth/register'}>Register here</Link></p>
                </div>
                    <div className="mt-10" >
                        <Suspense fallback="Loading...">
                            <GoogleLogin onSuccess={handleGoogleLoginSuccess}/>
                        </Suspense>
                        <ToastContainer/>
                    </div>
                <div>
                </div>
            </div>
            
        </form>   
    )
}