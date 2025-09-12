'use client';
import { ChartPieIcon, MagnifyingGlassCircleIcon, Square3Stack3DIcon, Squares2X2Icon, WalletIcon } from "@heroicons/react/24/outline"
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";


const links = [
    {name:'Dashboard', href:'/dashboard', icon:Squares2X2Icon},
    {name:'Wallet', href:'/wallet', icon:WalletIcon},
    {name:'Transactions' , href:'/transactions' , icon:Square3Stack3DIcon ,},
    {name:'Revenue Analytics' , href:'/revenue-analytics' , icon: ChartPieIcon,},
    {name:'Search' , href:'/search' , icon:MagnifyingGlassCircleIcon ,},
]

interface UserProfileProps {
    className?: string;
    theme?:string
}

export default function SideBarLinks({ className, theme }: UserProfileProps){

    const pathname = usePathname();
    
    return(
        <div className="flex flex-row md:flex-col md:items-center md:pb-11 md:mt-10 ml-3  transition-all duration-500 ease-in-out">
        {links.map((link)=>{
            const Icon = link.icon;
            return(
                <Link 
                key={link.name}
                href={link.href}
                className={clsx('flex px-4 py-1 mx-1 my-1 transition-all hover:scale-110 ease-in-out duration-300 justify-center md:justify-start relative rounded-xl w-[80%]',
                pathname===link.href?
                (theme==='dark'?
                     'bg-slate-100 text white'
                    :
                     'bg-blue-300')
                :
                (theme==='dark'?
                    ' text-slate-300 hover:bg-slate-600 hover:text-white':'hover:bg-blue-200'),
                className)}>
                <Icon title={link.name} className="md:w-4 w-7"/>
                <p className="hidden ml-1 md:block">{link.name}</p>
                </Link>
            )
        })}
        <div className="hidden md:block md:w-[80%] border-b-1 mt-5 ml-[-20]  transition-all duration-500 ease-in-out">
        </div>
        </div>
        
    )
}
