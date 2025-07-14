import Link from "next/link";
import NavLinks from "./navLinks";
import Image from "next/image";

export default function Navbar(){
    return(
        <nav className="flex opacity-50 sticky items-center justify-between h-15 bg-gray-100 shadow">
            <div className="relative px-2 py-2">
                <Link href='/'> <Image alt='logo' className="border-none rounded-md" width={50} height={50} src='/logo.png'/> </Link>
            </div>
            <NavLinks/>
        </nav>
    )
}