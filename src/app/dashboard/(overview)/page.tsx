
import ToggleTheme from "@/src/components/dashboard/ToggleTheme"
import { lusitana } from "@/src/assets/fonts/fonts"
import AuthGuard from "@/src/components/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";

export default function Page(){
    return (
        <AuthGuard>
            <main>
                {/* <Search placeholder="Search month"/> */}
                <div className="flex absolute top-5 right-10">
                    <ToggleTheme/>
                </div>
                <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
                <div>
                    <div className="grid grid-cols-6 grid-rows-6 gap-0">
                        <div className="col-start-1 row-start-1 col-end-3 row-end-3"> <CardWrapper title={"Card Details"}/> </div> {/** card details*/}
                        <div className="col-start-3 row-start-1 col-end-5 row-end-3"> <CardWrapper title={"Wallet"}/> </div> {/** wallet*/}
                        <div className="row-start-3 col-start-3 row-end-5 col-end-5 "><CardWrapper title={"Monthly Earnings"}/> </div> {/** monthly earnings*/}
                        <div className="row-start-5 col-start-3 row-end-7 col-end-5 "> <CardWrapper title={"Earnings"}/> </div> {/** earnings*/}
                        <div className="row-start-3 col-start-1 row-end-7 col-end-3 "> <CardWrapper title={"Transactions"}/></div> {/** transactions*/}
                        <div className="row-start-1 col-start-5 row-end-7 col-end-7 ">  <CardWrapper title={"Payable accounts, receipts"}/></div> {/** payable accounts, receipts, payables*/}
                    </div> 
                </div>
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
