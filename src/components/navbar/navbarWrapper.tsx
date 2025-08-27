'use client';
import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavBarWrapper(){
      const pathname = usePathname();
      const showPath = ['/', '/auth/login', '/auth/register']
    const showNavbar = showPath.includes(pathname);    
    return (showNavbar && <Navbar/>)
}