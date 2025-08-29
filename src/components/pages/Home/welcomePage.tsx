'use client';
import Image from "next/image";
import {useEffect, useState} from 'react';
import { Button } from "../../buttons/buttons";
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
        <div className={`flex items-center justify-center h-screen transition-opacity ease-in-out ${loaded ? 'opacity-90':'opacity-0'}`}>
            <div className="w-full absolute min-h-screen">
                <Image priority={true} className={`absolute w-full h-full  pointer-events-none`} alt='background image' width={500} height={500} src='/backgroundImage_new.png'/>
            </div>
            <div className="absolute items-center top-30">
                <h1 className="text-white sm:text-xl md:text-2xl text-lg lg:text-4xl">Welcome to the Expense Tracker App</h1>
                <h2 className="text-center text-white ">Take care of your expenses at one place.</h2>
            </div>
            <div className="items-center justify-center ml-[-90]">
                <Button href={isLoggedIn?'/dashboard':'/auth/login'} className="absolute top-50 sm:bottom-25 bottom-45 lg:bottom-25 bg-brand active:bg-brand-active whitespace-nowrap">Get Started</Button>
            </div>
        </div>
    )
}