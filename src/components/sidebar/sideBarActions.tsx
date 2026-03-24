'use client'
import { Cog6ToothIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../ui/buttons/logoutButton";

interface UserProfileProps{
    className?:string;
    theme?:string
}

export default function SideBarActions({className, theme}:UserProfileProps){
    const pathname = usePathname();
    const links=[
        {name:'Settings', href:'/dashboard/user/settings', icon:Cog6ToothIcon},
        {name:'help', href:'/help', icon:QuestionMarkCircleIcon},
    ];
    return(
        <div className="flex flex-row items-end sm:flex-col w-30 sm:space-x-0 space-x-2 sm:top-110 sm:ml-8  sm:items-center transition-all duration-500 ease-in-out">
            {links.map((link)=>{
                const Icon = link.icon;
                return(
                    <Link
                    key={link.name}
                href={link.href}
                className={clsx('sm:flex h-7 sm:py-1  relative rounded-xl w-7 sm:w-20 transition-all duration-500 ease-in-out',
                pathname===link.href?
                (theme==='dark'?
                     'bg-slate-100 text white'
                    :
                     'bg-blue-300')
                :
                (theme==='dark'?
                    ' text-slate-300 hover:bg-slate-600 hover:text-white':'hover:bg-blue-200  transition-all duration-500 ease-in-out')
                ,className)}
                >
                <Icon className="sm:w-4 w-7 "/>
                <p className="hidden ml-1 text-sm sm:text-sm sm:block  transition-all duration-500 ease-in-out">{link.name}</p>
                </Link>
                )
            })}
            <LogoutButton isClass={
                clsx("transition-all duration-500 ease-in-out",theme==='dark'?'text-slate-300 hover:bg-slate-600 hover:text-white':' hover:bg-blue-200', ' flex sm:top-16 sm:py-1 sm:ml-[-10] cursor-pointer sm:w-[65%] rounded-xl')
            }/>
        </div>
    )
}
