'use client';
import Link from "next/link";
import { useEffect } from "react";
import {useRouter } from "next/navigation";

export default function LogoutClient(){
    const router = useRouter();
    useEffect(()=>{
        const logout = async()=>{
            try{
                await fetch('http://localhost:5000/api/v1/auth/logout', {
                method:'POST',
                credentials:'include'
            });
            document.cookie=`accessToken=; path=/; maxAge=0`;
            console.log("logout successful, cookies cleared");
            setTimeout(()=>router.replace('/'), 5000);
            
            }catch(err){
                if(err instanceof Error)
                console.error(err.stack)
                
                console.error(err);
            }
        }
        logout();
    },[router]);
    return(
        <div className="border text-center">
            <h1> Logged out</h1>
            <p>You have been logged out successfully.</p>
            <p>Want to <Link href='/auth/login'>login</Link> again?</p>
        </div>
    )
}