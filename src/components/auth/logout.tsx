'use client';
import Link from "next/link";
import { useEffect } from "react";
import {useRouter } from "next/navigation";

export default function LogoutClient(){
    const router = useRouter();
    const Auth_Router = process.env.NEXT_PUBLIC_AUTH_SERVICE;
    useEffect(()=>{
        const logout = async()=>{
            try{
                await fetch(`${Auth_Router}/api/v1/auth/logout`, {
                method:'POST',
                credentials:'include'
            });
            document.cookie=`accessToken=; path=/; maxAge=0`;
            setTimeout(()=>router.replace('/'), 5000);
            
            }catch(err){
                if(err instanceof Error)
                console.error(err.stack)
                
                console.error(err);
            }
        }
        logout();
    },[Auth_Router, router]);
    return(
        <div className="border text-center">
            <h1> Logged out</h1>
            <p>You have been logged out successfully.</p>
            <p>Want to <Link href='/auth/login'>login</Link> again?</p>
        </div>
    )
}