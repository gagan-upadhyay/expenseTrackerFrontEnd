'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function NavLogo(){
    return(
        <Link href='/'> 
            <Image alt='logo' className="border-none rounded-md" width={50} height={50} src='/logo-removebg-preview.png'/> 
        </Link>
    )
    
}

