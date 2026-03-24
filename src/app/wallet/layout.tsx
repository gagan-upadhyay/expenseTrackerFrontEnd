import React from "react";
import SideBar from "@/src/components/dashboard/Sidebar";
import ToggleTheme from "@/src/components/dashboard/ToggleTheme";
import { UserProvider } from "@/src/context/userContext";
import ThemeSync from "@/src/components/dashboard/ThemeSync";
import { AccountProvider } from "@/src/context/accountContext";
import { TransactionProvider } from "@/src/context/transactionContext";


export default function DashBoardLayout({children}: {children:React.ReactNode}){
    return (
        <UserProvider>
            <AccountProvider>
                <TransactionProvider>
                    <ThemeSync/>
                    {/* 1. Use screen height and hide horizontal overflow */}
                    <div className="flex flex-col sm:flex-row h-screen overflow-hidden">
                        
                        {/* 2. Sidebar (Fixed width on desktop) */}
                        <div className="w-full flex-none sm:w-64 ">
                            <SideBar/>
                        </div>

                        {/* 3. Content Wrapper (Scrollable area) */}
                        <div className="flex-grow flex flex-col overflow-y-auto relative">
                            
                            {/* 4. Main content pushes footer down */}
                            <main className="flex-grow p-6 sm:p-12">
                                <div className="flex absolute top-5 right-10 z-10">
                                    <ToggleTheme/>
                                </div>
                                {children}
                            </main>
                        </div>
                    </div>
                </TransactionProvider>
            </AccountProvider>
        </UserProvider>
    );
}
