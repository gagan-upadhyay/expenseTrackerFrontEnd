'use client';
import { useTheme } from "@/src/context/themeContext";
import UserProfile from "../sidebar/userProfile";
import clsx from 'clsx';
import { lusitana } from "@/src/assets/fonts/fonts";
import SideBarLinks from "./SideBarLinks";
import SideBarActions from "./sideBarActions";
import { useUser } from "@/src/context/userContext";


export default function SidebarWrapper(){
    
    const {theme} = useTheme();
    const {user} =useUser();
    
    const fontClass = `${lusitana.className}`;
    const isDark = "bg-slate-900 text-gray-400";
    const isLight = "bg-[#F1F5FB] text-gray-700";
    // const textClass =  "text-black"
    const baseClass = "flex grow space-x-2 flex-col md:space-x-0 md:space-y-1 py-5  transition-all duration-500 ease-in-out border-r-0 rounded-2xl h-full h-40";
    
    const classForUserProfile = clsx(
        theme ==='light'?isLight:isDark,
        fontClass,
        " transition-all duration-500 ease-in-out"
    )
    const classes = clsx(
        classForUserProfile,
        baseClass,        
    );

    
    return(
        <>
            <div className={clsx(classes, "md:block hidden")}>
                <UserProfile  user={user ?? undefined} className = {classForUserProfile} />
                <SideBarLinks theme={theme} className = {classForUserProfile} />
                <SideBarActions theme={theme} className = {classForUserProfile}/>
            </div>
            
            <div className={clsx(classes, "md:hidden block")}>
                <div className="flex flex-row items-center ">
                    <UserProfile user={user ?? undefined}/>
                    <div className="flex absolute right-20 top-7">
                        <SideBarActions theme={theme} className={classForUserProfile}/>
                    </div>
                </div>
                <div className="mt-4">
                    <SideBarLinks theme={theme} className={classForUserProfile}/>
                </div>
            </div>
        </>
    )
}