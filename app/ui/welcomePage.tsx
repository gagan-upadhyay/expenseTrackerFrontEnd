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
        <main className={`flex items-center justify-center h-screen transition-opacity ease-in-out ${loaded ? 'opacity-90':'opacity-0'}`}>
            <div className="w-full min-h-screen">
                <Image priority={true} className={`absolute w-full h-full  pointer-events-none`} alt='background image' width={500} height={500} src='/backgroundImage_new.png'/>
            </div>
            <div className="absolute top-10">
                <h1 className="text-white sm:text-xl md:text-2xl text-lg lg:text-4xl">Welcome to the Expense Tracker App</h1>
                <h2 className="text-center text-white ">Take care of your expenses at one place.</h2>
            </div>
            <div>
                <Button href='/auth/login' className="absolute top-30 bg-brand active:bg-brand-active sm:bottom-25  md:right-100 md:bottom-25 lg:right-140 bottom-45 right-[140px] lg:bottom-25 whitespace-nowrap">Get Started</Button>
            </div>
        </main>
    )
}