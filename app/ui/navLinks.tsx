'use client';

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks(){
    const links = [
        {'label':'About', 'href':'/about'},
        {'label':'Contact', 'href':'/contact'},
    ]
    const currentPath = usePathname();  
    
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

        </ul>
    )
}