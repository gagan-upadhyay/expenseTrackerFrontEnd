'use client';
import { usePathname } from "next/navigation";
import Navbar from "../ui/navbar/navbar";

export default function NavBarWrapper(){
      const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');    
    return (!isDashboard && <Navbar/>)
}