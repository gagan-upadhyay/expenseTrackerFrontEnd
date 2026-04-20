import React from "react";
import SideBar from "@/src/components/dashboard/Sidebar";
import { UserProvider } from "@/src/context/userContext";
import ThemeSync from "@/src/components/dashboard/ThemeSync";
import { AccountProvider } from "@/src/context/accountContext";
import { TransactionProvider } from "@/src/context/transactionContext";
import { SidebarProvider } from "@/src/context/sidebarContext";
import MainContent from "@/src/components/layout/MainContent";
// import Breadcrumbs from "@/src/components/ui/Breadcrumbs";

export default function TransactionLayout({children}: {children:React.ReactNode}){
    return (
        <UserProvider>
            <AccountProvider>
                <TransactionProvider>
                    <ThemeSync/>
                    <div className="flex h-screen w-full flex-col sm:flex-row sm:overflow-hidden">
                        {/* <div className="w-full flex-none sm:w-64"> */}
                        <SidebarProvider>
                            <SideBar/>
                            <MainContent>
                                {/* <Breadcrumbs/> */}
                                <div className="flex-grow sm:overflow-y-auto">
                                    {children}
                                </div>
                            </MainContent>
                        </SidebarProvider>
                    </div>
                </TransactionProvider>
            </AccountProvider>
        </UserProvider>
    );
}