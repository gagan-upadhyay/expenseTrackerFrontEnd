'use client';

import { lusitana } from "@/src/assets/fonts/fonts";
import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";
import { Button } from "@/src/components/ui/buttons/buttons";
import { useAccounts } from "@/src/context/accountContext";


export default function Page() {
  const { accounts } = useAccounts();

  return (
    <AuthGuard>
      <main className="relative p-4">
        {/* Theme Toggle */}

        {accounts?.length===0 ?
        <div className="h-screen glass glass-hover rounded-xl w-full flex transition-all duration-500 ease-in-out justify-center items-center">
          <div className=" top-10">
            <Button href="/account/add" className="p-4 hover:shadow-xl hover:shadow-blue-100/10">Click here to add Account details</Button>
          </div>
        </div>
        
        : (
          <>
            <h1 className={`${lusitana.className} mb-4 mt-7 font-bold text-xl md:text-2xl`}>
                <u>Dashboard</u>
            </h1>

            <div className="w-full">
              <div
                className="
                  grid gap-5
                  grid-cols-1
                  md:grid-cols-2
                  lg:grid-cols-6 auto-rows-[minmax(120px,auto)]
                "
              >
                {/* Card Details */}
                {/* <div className="lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-1">
                  <CardWrapper title="Card Details" />
                </div> */}

                {/* Wallet */}
                {/* <div className="lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-2 h-full">
                  <CardWrapper title="Wallet" />
                </div> */}

                {/* Monthly Spent */}
                {/* <div className="lg:col-start-3 lg:col-end-5 lg:row-start-2 lg:row-end-3">
                  <CardWrapper title="Monthly Spent" />
                </div> */}

                {/* Earnings (FIXED - no overlap now) */}
                {/* <div className="lg:col-start-3 lg:col-end-5 lg:row-start-3 lg:row-end-7">
                  <CardWrapper title="Savings" />
                </div> */}

                {/* Transactions */}
                {/* <div className="lg:col-start-1 lg:col-end-3 lg:row-start-[2] lg:row-end-7">
                  <CardWrapper title="Transactions" />
                </div> */}

                {/* Payables */}
                {/* <div className="lg:col-start-5 lg:col-end-7 lg:row-start-1 lg:row-end-7">
                  <CardWrapper title="Payable Accounts, Receipts" />
                </div> */}

                <div className="lg:col-span-2">
                  <CardWrapper title="Card Details" />
                </div>
                <div className="lg:col-span-2">
                  <CardWrapper title="Wallet" />
                </div>
                <div className="lg:col-span-2 lg:row-span-3">
                  <CardWrapper title="Payable Accounts, Receipts" />
                </div>

                <div className="lg:col-span-2 lg:row-span-4">
                  <CardWrapper title="Transactions" />
                </div>
                <div className="lg:col-span-2">
                  <CardWrapper title="Monthly Spent" />
                </div>
                <div className="lg:col-span-2 lg:row-span-2">
                  <CardWrapper title="Savings" />
                </div>
              </div>
            </div>
          </>
        )
      }
      </main>
    </AuthGuard>
  );
}