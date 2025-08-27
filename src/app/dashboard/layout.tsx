import React from "react";
import SideBar from "@/src/components/dashboard/Sidebar";
// import { AuthProvider } from "../context/authContext";
// import { GoogleOAuthProvider } from "@react-oauth/google";



export default function DashBoardLayout({children}: {children:React.ReactNode}){
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideBar/>
            </div>
            <div className="flex-grow p-6 md:p-12 md:overflow-y-auto">
                {children}
            </div>
    </div>
         
    );
}