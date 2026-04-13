'use client'
import { useAccounts } from "@/src/context/accountContext"
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/buttons/buttons";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import { useState } from "react";
import { fetchedCardsDetails } from "@/src/utils/definitions";
import BlurCard from "./addCardBlur";
import { GrTransaction } from "react-icons/gr";
import CardPreview from "./CardPreview";
// import { CardDetails } from "@/src/utils/definitions";
// import { CardDetails } from "@/src/utils/definitions";

interface Props{
    parentClass:string;
}

export default function SingleAccountDetails({parentClass}:Props){
    const {accounts, cards} = useAccounts();
    // const [error, setError] = useState<string|null>(null);
    const[openCards, setOpenCards] = useState<boolean>(false);
    const router = useRouter();

    const params = useParams();
    const accountId = params.accountId;
    const accountExists = accounts?.find((acc)=>acc.id===accountId)
    
    const toggleCard =()=> setOpenCards(prev=>!prev);
    
    const savedCards:fetchedCardsDetails[] = cards?.filter((card)=>card.account_id===accountId) || [];

    console.log('Value of savedCards:', savedCards);
    const account = accounts?.find((acc)=>acc.id===accountId);
    
    
      if (!accountExists || !accounts) {
        return (
          <div className={clsx(parentClass, "w-full mt-6 relative")}> 
            <div className="glass p-6 rounded-2xl">
              <p className="text-center opacity-70">No Account Found</p>
              <button
                onClick={() => router.push("/account/add")}
                className="mt-3 glass-hover w-full py-2 rounded-xl text-sm"
              >
                Add Account
              </button>
            </div>
          </div>
        );
      }
    return(
        <div className="h-screen mt-5">
            <div key={account?.id} className="glass p-4 rounded-2xl border border-[var(--color-border)]">
            {/* <div className="flex justify-between items-center"> */}
                {/* <div> */}
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{account?.account_type}</h4>
                    <span className="text-xs uppercase opacity-70">{account?.currency_code}</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                    {getCurrencySymbol(account?.currency_code)} {account?.remaining_balance}
                </p>
                <div className="mt-3 flex items-center gap-2 justify-between text-xs">
                    <div className="flex gap-2">
                        <span className="glass px-2 py-1 rounded-md text-green-700">Income: {getCurrencySymbol(account?.currency_code)} {account?.total_income}</span>
                        <span className="glass px-2 py-1 rounded-md text-red-700">Expense: {getCurrencySymbol(account?.currency_code)} {account?.total_expense}</span>
                    </div>
                    <Button onClick={() => router.push(`/transactions/add?accountId=${account?.id}`)} className="w-fit h-fit flex items-center gap-2"> 
                    <GrTransaction />
                    <span className="hidden sm:inline">Transactions</span>
                    </Button>
                </div>
                <p className="mt-2 text-xs opacity-70">Opening: {getCurrencySymbol(account?.currency_code)} {account?.opening_balance}</p>
            </div>

            {/* <CardWrapper title="Transactions"/> */}

            <div className="glass p-4 mt-2 rounded-2xl">
                <div className="flex justify-between mb-10 text-xs items-center">
                    <h4 className="text-sm opacity-70 mb-3">Saved Cards</h4>
                    <Button onClick={toggleCard} className="w-fit h-fit">Show Cards</Button>
                </div>
                {!savedCards && (
                <p className="text-xs opacity-60">No cards added yet</p>
                )}
                {(savedCards && openCards && (
                        <>
                            <div className={clsx("flex gap-4 overflow-x-auto overflow-y-hidden  whitespace-nowrap no-scrollbar pb-2",

                            )} style={{ scrollSnapType: "x mandatory" }}>
                                <BlurCard/>
                                {savedCards.map((c:fetchedCardsDetails) => (
                                    <div key={c.id} className="min-w-[280px] flex-shrink-0 scroll-snap-align-start">
                                        <CardPreview card={c} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )
                )}
            </div>
        </div>

    )
}