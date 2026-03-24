'use client';
import ToggleTheme from "@/src/components/dashboard/ToggleTheme"
import { lusitana } from "@/src/assets/fonts/fonts"
import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";
import { useAccounts } from "@/src/context/accountContext";

export default function Page(){
    const {accounts} = useAccounts();
    console.log('Value of accounts:', accounts);
    return (
        <AuthGuard>
            <main>
                {/* <Search placeholder="Search month"/> */}
                <div className="flex absolute top-5 right-10">
                    <ToggleTheme/>
                </div>
                { accounts && 
                    <>
                        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                            Dashboard
                        </h1>
                    
                        <div className="w-full">
                            <div
                                className="
                                grid 
                                gap-4
                                /* Small (stack everything) */
                                grid-cols-1
                                /* Medium (2 columns layout) */
                                md:grid-cols-2
                                /* Large layout: 6 columns, 6 rows */
                                lg:grid-cols-6
                                lg:grid-rows-6
                                "
                                >
                                {/* Card Details */}
                                <div className="lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2">
                                <CardWrapper pageClass="" title="Card Details" />
                                </div>

                                {/* Wallet */}
                                <div className="lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-2">
                                <CardWrapper pageClass="" title="Wallet" />
                                </div>

                                {/* Monthly Earnings */}
                                <div className="lg:col-start-3 lg:col-end-5 lg:row-start-2 lg:row-end-5">
                                <CardWrapper pageClass="" title="Monthly Earnings" />
                                </div>

                                {/* Earnings */}
                                <div className="lg:col-start-3 lg:col-end-5 lg:row-start-4 lg:row-end-7">
                                <CardWrapper pageClass="" title="Earnings" />
                                </div>

                                {/* Transactions */}
                                <div className="lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-7">
                                <CardWrapper pageClass="" title="Transactions" />
                                </div>

                                {/* Payables */}
                                <div className="lg:col-start-5 lg:col-end-7 lg:row-start-1 lg:row-end-7">
                                <CardWrapper pageClass="" title="Payable Accounts, Receipts" />
                                </div>
                            </div>
                        </div>
                    </>
                }

            </main>
        </AuthGuard>
    )
}




// .div1 { grid-area: 1 / 1 / 3 / 3; }
// .div2 { grid-area: 1 / 3 / 3 / 5; }
// .div3 { grid-area: 3 / 3 / 5 / 5; }
// .div4 { grid-area: 5 / 3 / 7 / 5; }
// .div5 { grid-area: 3 / 1 / 7 / 3; }
// .div6 { grid-area: 1 / 5 / 7 / 7; }
