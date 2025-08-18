'use client';
import { useTheme } from "@/app/context/themeContext";
import UserProfile from "../sidebar/userProfile";
import clsx from 'clsx';
import { lusitana } from "../fonts";
import SideBarLinks from "./SideBarLinks";
import SideBarActions from "./sideBarActions";
import { useState, useEffect } from "react";
import { getUserDetails } from "@/app/utils/data";

export default function SidebarWrapper(){
    
    const {theme} = useTheme();
    const[user, setUser] = useState(null);

    useEffect(()=>{
        const fetchUser = async()=>{
            try{
                const userData = await getUserDetails();
                console.log("Value of userData from sideWrapper", userData);
                if(!userData) console.error("Unable to fetch the userData:\n", userData);

                setUser(userData.result);

                
            }catch(err){
                console.error('Error fetching user:', err);
            }
        };
        fetchUser();
    }, []);

    console.log("Value of theme from sideBar:\n",theme);
    console.log("Value of user:\n", user);
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
                <UserProfile user={user ?? undefined} className = {classForUserProfile} />
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