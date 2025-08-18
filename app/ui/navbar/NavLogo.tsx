'use client';
import Link from 'next/link';
import { useAuth } from "../../context/authContext"
import Image from 'next/image';

export default function NavLogo(){
    const {isLoggedIn} = useAuth();
    return(
        <Link href={isLoggedIn?'/dashboard':'/'}> 
            <Image alt='logo' className="border-none rounded-md" width={50} height={50} src='/logo.png'/> 
        </Link>
    )
    
}

