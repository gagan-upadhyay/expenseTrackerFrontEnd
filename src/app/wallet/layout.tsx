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


export default function DashBoardLayout({children}: {children:React.ReactNode}){
    return (
        <UserProvider>
            <AccountProvider>
                <TransactionProvider>
                    <ThemeSync/>
                    {/* <div className="flex h-screen flex-col sm:flex-row sm:overflow-hidden"> */}
                        {/* <div className="w-full flex-none sm:w-64">
                            <SideBar/>
                        </div> */}
                        <SidebarProvider>
                            <SideBar/>
                            <MainContent>
                                {/* <div className="flex-grow p-6 sm:p-12 sm:overflow-y-auto"> */}
                                <Breadcrumbs/>
                                    {children}
                                {/* </div> */}
                            </MainContent>
                        </SidebarProvider>
                    {/* </div> */}
                </TransactionProvider>
            </AccountProvider>
        </UserProvider>
    );
}
