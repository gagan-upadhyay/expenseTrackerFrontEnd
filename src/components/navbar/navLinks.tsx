'use client';

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../buttons/logoutButton";
import { useAuth } from "@/src/context/authContext";
import ToggleTheme from "../dashboard/ToggleTheme";
import { useTheme } from "@/src/context/themeContext";


export default function NavLinks(){
    const currentPath = usePathname();  
    const hiddenPaths = ['/', '/auth/login', '/auth/register'];
    const shouldShowButton = !hiddenPaths.includes(currentPath);
    const {isLoggedIn} = useAuth();
    const {theme} = useTheme();

    const links = [
        {'label':'About', 'href':'/about'},
        {'label':'Contact', 'href':'/contact'},        
    ]



    return(
        <ul className="flex items-center mr-10 space-x-6 ml-5">
            <ToggleTheme/>
           
            {links.map(link=>(
                <Link 
                key={link.href}
                href={link.href}
                className = {classNames(theme==='light'?{
                    
                    'text-gray-900': link.href === currentPath,
                    'text-gray-500': link.href !== currentPath,
                    'hover:text-gray-800 transition-colors duration-200': true
                }:{
                    'text-neutral-300':link.href===currentPath,
                    'text-neutral-600':link.href!==currentPath,
                    'hover:text-neutral-400 transition-colors duration-200':true
                    
                    })}>
                    {link.label}
                </Link>
            ))}
            
            {shouldShowButton && isLoggedIn && (
                <LogoutButton
                    isClass={classNames(theme==='light'?{'text-gray-500':true,'hover:text-gray-800 transition-colors duration-200': true}:
                        {
                            'text-neutral-300':true,
                            'hover:text-neutral-800 transition-colors duration-200':true,
                        }
                    )}
                />    
            )}
        </ul>
    )
}