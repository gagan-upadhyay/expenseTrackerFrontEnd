import React from "react";
import SideBar from "@/src/components/dashboard/Sidebar";
import ToggleTheme from "@/src/components/dashboard/ToggleTheme";
import { UserProvider } from "@/src/context/userContext";
import ThemeSync from "@/src/components/dashboard/ThemeSync";
import { AccountProvider } from "@/src/context/accountContext";
// import { TransactionProvider } from "@/src/context/transactionContext";

export default function AccountLayout({children}: {children:React.ReactNode}){
    return (
        <UserProvider>
            <AccountProvider>
                {/* <TransactionProvider> */}
                    <ThemeSync/>
                    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                        <div className="w-full flex-none md:w-64">
                            <SideBar/>
                        </div>
                        <div className="flex-grow p-6 md:p-12 md:overflow-y-auto">
                            <div className="flex absolute top-5 right-10">
                                <ToggleTheme/>
                            </div>
                            {children}
                        </div>
                    </div>
                {/* </TransactionProvider> */}
            </AccountProvider>
        </UserProvider>
    );
}