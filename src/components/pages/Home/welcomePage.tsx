'use client';
import Image from "next/image";
import {useEffect, useState} from 'react';
import { Button } from "../../ui/buttons/buttons";
import { useAuth } from "../../../context/authContext";
import { useRouter } from "next/navigation";


export default function WelcomePage(){
    const [loaded, setLoaded] = useState(false);
    const {isLoggedIn} = useAuth();
    const router = useRouter();
    console.log("Value of isLoggedIn", isLoggedIn);

    useEffect(()=>{
        const timer = setTimeout(()=>setLoaded(true), 300);
        return ()=> clearTimeout(timer)
    }, []);

    const handleSubmit=()=>{
        if (isLoggedIn){
            router.push('/dashboard');
        }else{
            router.push('/auth/login');
        }
    }


    return (
        <div className={`flex justify-center h-screen transition-opacity ease-in-out ${loaded ? 'opacity-90':'opacity-0'}`}>
            <div className="w-full absolute min-h-screen">
                <Image className={`absolute w-full h-full  pointer-events-none`} alt='background image' width={500} height={500} src='/backgroundImage_new.png'/>
            </div>
            <div className="relative flex flex-col top-10 text-center gap-2 px-4">
                <h1 className="text-white animate-pulsate transitions-all ease-in-out duration-400 sm:text-xl md:text-2xl text-lg lg:text-4xl ">
                    Welcome to the Expense Tracker App
                </h1>

                <h2 className="text-white lg:text-2xl transitions-all ease-in-out duration-400">
                    Take care of your expenses at one place.
                </h2>
                <Button onClick={handleSubmit} className="mt-10">
                    Get Started
                </Button>


            </div>
            
        </div>
    )
}