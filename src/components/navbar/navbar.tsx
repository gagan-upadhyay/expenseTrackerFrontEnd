import NavLinks from "./navLinks";
import NavLogo from "./NavLogo";

type NavbarProps={
    theme:string;
}

export default function Navbar({theme}:NavbarProps){
    console.log("value of theme",theme==='light');
    
    return(
        <nav className={`opacity-80 sticky w-screen items-center justify-between h-16 shadow ${theme==='light' ? 'shadow-[0_1px_6px_-2px_rgba(18,18,20,1)] bg-gray-100':'bg-neutral-900 shadow-[0_1px_6px_-1px_rgba(229,231,235,1)]'}`}>
            <div className="relative items-center justify-between flex px-2 py-2">
                <NavLogo/>
                <NavLinks/>
            </div>
        </nav>
    )
}