'use client';

import { useTheme } from "@/src/context/themeContext";
import { FaCcVisa } from "react-icons/fa";
import CreditCard from "./creditCards";
import { lusitana } from "@/src/assets/fonts/fonts";
import clsx from "clsx";
import WalletCard from "./walletCard";
// import TransactionCard from "./transactionCard";
// import TransactionCardWrapper from "./transactionCardWrapper";
import TransactionCard from "./transactionCard";
import { ExpenseChart } from "../ui/charts/charts";
import {EarningsChart } from "../ui/charts/lineChart";
// import { ChartContainer, ChartPieDonutText } from "../ui/charts/charts";
// import { useAccounts } from "@/src/context/accountContext";

interface CardProps{
    title:string;
    pageClass:string;
}

export default function CardWrapper({title, pageClass}:CardProps){
    const {theme}= useTheme();
    const fontClass = `${lusitana.className} `;
    const isDark = " bg-gradient-to-r from-silverGray to-darkBlueGray text-gray-400 border-sky-200 focus:ring-sky-300";
    const isLight = "bg-[#F1F5FB] text-gray-700 border-blue-900 focus:ring-blue-400";

    const ParentClass = clsx(
        theme==='light'? isLight : isDark,
        fontClass,
        pageClass!==''? pageClass:'');
    const transitionClass ='transition-all ease-in-out duration-500'

    
    return (
        <>
            {title === 'Card Details' ? (
                <CreditCard parentClass={ParentClass} transitionClass={transitionClass} />
            ) : title ==='Wallet'? 
            <WalletCard  parentClass={ParentClass} transitionClass={transitionClass} />
            :title==='Transactions'?
            <TransactionCard pageClass={ParentClass} transitionClass={transitionClass} />
            : title ==='Monthly Earnings'? 
            // <ChartPieDonutText/>
            <ExpenseChart/>
            : title ==='Earnings'?<EarningsChart/>
            :
            (
                <div className={`border rounded-lg p-4 shadow-md`}>
                    <h3 className="text-lg text-center font-semibold"> {title} </h3>
                    <FaCcVisa size={60}/>
                </div>
            )}
        </>
    )
}
