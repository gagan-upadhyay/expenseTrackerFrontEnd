'use client';
import Image from "next/image";
import {useEffect, useState} from 'react';
import { Button } from "../../ui/buttons/buttons";
import { useAuth } from "../../../context/authContext";


export default function WelcomePage(){
    const [loaded, setLoaded] = useState(false);
    const {isLoggedIn} = useAuth();
    console.log("Value of isLoggedIn", isLoggedIn);

    useEffect(()=>{
        const timer = setTimeout(()=>setLoaded(true), 300);
        return ()=> clearTimeout(timer)
    }, []);


    return (
        <div className={`flex justify-center h-screen transition-opacity ease-in-out ${loaded ? 'opacity-90':'opacity-0'}`}>
            <div className="w-full absolute min-h-screen">
                <Image priority={true} className={`absolute w-full h-full  pointer-events-none`} alt='background image' width={500} height={500} src='/backgroundImage_new.png'/>
            </div>
            <div className="relative flex flex-col top-10 text-center gap-2 px-4">
                <h1 className="text-white animate-pulsate transitions-all ease-in-out duration-400 sm:text-xl md:text-2xl text-lg lg:text-4xl ">
                    Welcome to the Expense Tracker App
                </h1>

                <h2 className="text-white lg:text-2xl transitions-all ease-in-out duration-400">
                    Take care of your expenses at one place.
                </h2>

                <Button
                    href={isLoggedIn ? '/dashboard' : '/auth/login'}
                    className="text-xs md:text-sm lg:text-lg text-xs md:text-sm bg-brand active:bg-brand-active px-6 py-3"
                >
                    Get Started
                </Button>
            </div>
            
        </div>
    )
}