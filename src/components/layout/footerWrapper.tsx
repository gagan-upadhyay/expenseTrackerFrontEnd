'use client';
import { usePathname } from "next/navigation";
import Footer from "../footer";
export default function FooterWrapper(){
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');
    return !isDashboard && <Footer/>
}