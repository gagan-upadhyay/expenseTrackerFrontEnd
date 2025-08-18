'use client';

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../buttons/logoutButton";


export default function NavLinks(){
    const currentPath = usePathname();  
    const hiddenPaths = ['/', '/auth/login', '/auth/register'];
    const shouldShowButton = !hiddenPaths.includes(currentPath);

    const links = [
        {'label':'About', 'href':'/about'},
        {'label':'Contact', 'href':'/contact'},        
    ]



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
                <LogoutButton
                    isClass={classNames({'text-gray-600':true,'hover:text-gray-400 transition-colors duration-200': true})}
                />    
            )}
            
        </ul>
    )
}