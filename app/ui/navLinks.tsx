'use client';

import classNames from "classnames";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
// import { logout, goToLogin } from "../utils/authFunctions"; 

// import { useState } from "react";

export default function NavLinks(){


    const currentPath = usePathname();  
    const {accessToken, isLoggedIn} = useAuth();
    const hiddenPaths = ['/', '/auth/login', '/auth/register'];
    const shouldShowButton = !hiddenPaths.includes(currentPath);

    console.log("value of isLoggedIn", isLoggedIn);
    console.log('The value of accessToken from navLinks:', accessToken);
    const links = [
        {'label':'About', 'href':'/about'},
        {'label':'Contact', 'href':'/contact'},        
    ]
    console.log("value of isLoggedIn from navLinks:\n",isLoggedIn)
    
    const router = useRouter();
    
    const logout = async()=>{
        try{
            await fetch('http://localhost:5000/api/v1/auth/logout',{
                method:'POST',
            });
            document.cookie = `accessToken=; path=/; MaxAge=0`;
            document.cookie = `refreshToken=; path=/; MaxAge=0`;
            setTimeout(()=>router.replace('/'), 300);
        }catch(err){
            if(err instanceof Error) console.log("Error found in logout Server side:\n", err.stack);
        }
    }
    
    



    return(
        <ul className="flex items-center mr-10 space-x-6 ml-5">
           
            {links.map(link=>(
                <Link 
                key={link.href}
                href={link.href}
                className = {classNames({
                    'text-gray-600': link.href === currentPath,
                    'text-gray-700': link.href !== currentPath,
                    'hover:text-gray-400 transition-colors duration-200': true
                })}>
                    {link.label}
                </Link>
            ))}
            
            {shouldShowButton && (
                <button
                    className={classNames({'text-gray-600':true,'hover:text-gray-400 transition-colors duration-200': true})}
                    onClick={() => {
                        if (isLoggedIn) {
                            logout();
                        } else {
                            router.replace('/auth/login');
                        }
                    }}
                >
                    {isLoggedIn ? 'Logout' : 'Login'}
                </button>
            )}
        </ul>
    )
}