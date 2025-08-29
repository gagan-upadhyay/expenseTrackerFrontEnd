'use client';
import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import { useTheme } from "@/src/context/themeContext";

export default function NavBarWrapper(){
  const theme = useTheme().theme;
  console.log("Type of theme from wrapper:\n", typeof(theme));
  const pathname = usePathname();
  const showPath = ['/', '/auth/login', '/auth/register', '/about', '/contact'];
  const showNavbar = showPath.includes(pathname);    
  return (showNavbar && <Navbar theme={theme}/>)
}