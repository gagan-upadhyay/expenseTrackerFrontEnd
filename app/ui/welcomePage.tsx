'use client';
import Image from "next/image";
import {useEffect, useState} from 'react';
import { Button } from "./buttons";


export default function WelcomePage(){
    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        const timer = setTimeout(()=>setLoaded(true), 300);
        return ()=> clearTimeout(timer)
    }, []);


    return (
        <main className={`flex items-center justify-center min-h-screen relative transition-opacity duration-1000 ease-in-out ${loaded ? 'opacity-90':'opacity-0'}`}>
            <div className="w-full min-h-screen">
                <Image className={`absolute w-full h-full  pointer-events-none`} alt='background image' width={500} height={500} src='/backgroundImage_new.png'/>
            </div>
            <div className={`relative z-10 sm:right-20 sm:bottom-40 md:right-30 md:bottom-40 bottom-60 right-[-50px] lg:right-60 lg:bottom-40 
                 whitespace-nowrap pointer-events-none w-full max-w-xl `}>
                <h1 className="text-white relative sm:text-xl md:text-2xl text-lg lg:text-4xl">Welcome to the Expense Tracker App</h1>
                <h2 className="text-center relative text-white ">Take care of your expenses at one place.</h2>
            </div>
            <div>
                <Button href='/auth/login' className="relative bg-brand active:bg-brand-active sm:bottom-25  md:right-100 md:bottom-25 lg:right-140 bottom-45 right-[140px] lg:bottom-25 whitespace-nowrap">Get Started</Button>
            </div>
        </main>
    )
}