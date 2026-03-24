'use client';

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/buttons/buttons";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { forgotPassword } from "@/src/services/authService";
import { useRouter } from "next/navigation";

export default function ForgotPassword(){
    const emailRef = useRef<HTMLInputElement>(null);
    const [email, setEmail] = useState<string>('');
    const [disableForm, setDisableForm] = useState<boolean>(false);
    const[showMessage, setShowMessage] = useState<string>('');
    const router = useRouter();


    useEffect(()=>{
        if(emailRef.current){
            emailRef.current.focus();
        }
        // console.log("Value of email:", email);
        setShowMessage('');
    }, []);

    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        const response: {success:boolean, message:string, token:string|null} = await forgotPassword(email) as {success:boolean, message:string, token:string|null};
        console.log('Value of rsponse from forgotPassword:\n', response);
        if(response?.message ==="Can't change password for OAUTH type accounts"){
            setShowMessage('Account is OAUTH type. Use google OAUTH option in login page');
            setDisableForm(true);
            setTimeout(()=>{
                <p>Rerouting to login page...</p>
                router.push('/auth/login');
                
            }, 500)
        }else if(response.message === "User doesn't exists"){
            setShowMessage("User is not registered. Login first");
            setTimeout(()=>{
                <p>Rerouting to register page</p>
                router.push('/auth/register');
            }, 500);
        }else if(response.message ==="Email is not valid"){
            setShowMessage("email is not valid, Try again!");
        }else if(response.message ==="Magic link sent"){
            setShowMessage('Mail has been sent to the email');
            setDisableForm(true);
            setTimeout(()=>{
                <p>Rerouting to landing page...</p>
                router.push('/');
                
            }, 1000)
        }
        
    }

    return(
        <form onSubmit={handleSubmit} 
        className="w-full px-6 transition-all ease-in-out duration-400 pb-4 pt-8 bg-gray-50 rounded-lg mb-30 max-w-xs md:max-w-sm"
        >
            <h1 className="text-2xl ml-1 text-gray-400 font-bold mb-4">
                Forgot Password
            </h1>
            <div className="flex-1">
                <div>
                    <label htmlFor="email" className=" hidden md:block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                    type="email"
                    onChange={(e)=>setEmail(e.target.value)}
                    ref={emailRef}
                    className="py-[9px] placeholder:text-gray-500 pl-10 text-sm mt-1 w-full px-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:shadow-xl focus:ring-blue-500 text-black"
                    disabled={disableForm}
                    />
                    <AtSymbolIcon
                    className="pointer-events-none top-[-27] text-gray-500 relative ml-2 h-[18px] w-[18px]"
                    />
                    <div>
                    <p className="transition-all duration-400 ease-in-out text-gray-500 text-xs md:left-1 relative">Not Registered? <Link className="text-blue-400" href={'/auth/register'}>Register here</Link></p>
                </div>
                </div>
                {/* centre the submit button */}
                <div className="flex justify-center mt-4">
                    <Button disabled={disableForm} href="">Submit</Button>
                </div>
                
                <div className="w-auto py-1">
                    <p className="text-green-500/70">{showMessage}</p>
                </div>
            </div>
        </form>
    )
}