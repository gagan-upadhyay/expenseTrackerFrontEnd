import NavLinks from "./navLinks";
import NavLogo from "./NavLogo";

export default function Navbar(){
    
    return(
        <nav className="opacity-80 sticky items-center justify-between h-15 bg-gray-100 shadow">
            <div className="relative items-center justify-between flex px-2 py-2">
                <NavLogo/>
                <NavLinks/>
            </div>
        </nav>
    )
}