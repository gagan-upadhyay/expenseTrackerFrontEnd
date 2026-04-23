import React from "react";
import SideBar from "@/src/components/dashboard/Sidebar";
// import ToggleTheme from "@/src/components/dashboard/ToggleTheme";
import { UserProvider } from "@/src/context/userContext";
import ThemeSync from "@/src/components/dashboard/ThemeSync";
import { AccountProvider } from "@/src/context/accountContext";
import { TransactionProvider } from "@/src/context/transactionContext";
import { SidebarProvider } from "@/src/context/sidebarContext";
import MainContent from "@/src/components/layout/MainContent";
import Breadcrumbs from "@/src/components/ui/Breadcrumbs";


export default function WalletLayout({children}: {children:React.ReactNode}){
    return (
        <UserProvider>
            <AccountProvider>
                <TransactionProvider>
                    <ThemeSync/>
                    <SidebarProvider>
                        <div className="flex h-full flex-col sm:flex-row sm:overflow-hidden">
                            {/* <div className="w-full flex-none sm:w-64"> */}
                                <SideBar/>
                            {/* </div> */}
                            
                            <SideBar/>
                            
                                <div className="flex-grow  sm:overflow-y-auto no-scrollbar">
                                    <MainContent>
                                {/* <Breadcrumbs/> */}
                                    {children}
                            </MainContent>
                                </div>
                        </div>
                    </SidebarProvider>
                </TransactionProvider>
            </AccountProvider>
        </UserProvider>
    );
}
