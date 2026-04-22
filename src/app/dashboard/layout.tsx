import React from "react";
import SideBar from "@/src/components/dashboard/Sidebar";
import DashboardNavbar from "@/src/components/navbar/dashboardNavbar";
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
                    <SidebarProvider>
                        {/* Navbar for Desktop (lg screens and up) */}
                        <div className="hidden lg:block">
                            <DashboardNavbar />
                        </div>

                        {/* Sidebar for Mobile & Tablet */}
                        <div className="flex h-screen flex-col lg:flex-row lg:overflow-hidden">
                            <div className="lg:hidden">
                                <SideBar/>
                            </div>
                            
                            <MainContent>
                                <Breadcrumbs/>
                                {children}
                            </MainContent>
                        </div>
                    </SidebarProvider>
                </TransactionProvider>
            </AccountProvider>
        </UserProvider>
    );
}
