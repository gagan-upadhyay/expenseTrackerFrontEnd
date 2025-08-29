'use client';
import { useTheme } from "@/src/context/themeContext";
import UserProfile from "../sidebar/userProfile";
import clsx from 'clsx';
import { lusitana } from "@/src/assets/fonts/fonts";
import SideBarLinks from "./SideBarLinks";
import SideBarActions from "./sideBarActions";
import { useUser } from "@/src/context/userContext";
// import { useState, useEffect } from "react";
// import { getUserDetails } from "@/src/utils/data";
// import { useUser } from "@/src/context/userContext";
// import { useSession } from "@/src/Hooks/userHooks/userHook";

export default function SidebarWrapper(){
    
    const {theme} = useTheme();
    const {user} =useUser();
    
    // console.log("Value of theme from sideBar:\n",theme);
    // console.log("Value of user and loading usinf hook useSession from sideWrapper :\n", user);
    const fontClass = `${lusitana.className}`;
    const isDark = "bg-slate-900 text-gray-400";
    const isLight = "bg-[#F1F5FB] text-gray-700";
    // const textClass =  "text-black"
    const baseClass = "flex grow space-x-2 flex-col md:space-x-0 md:space-y-1 py-5  border-r-0 rounded-2xl h-full h-40";
    
    const classForUserProfile = clsx(
        theme ==='light'?isLight:isDark,
        fontClass
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