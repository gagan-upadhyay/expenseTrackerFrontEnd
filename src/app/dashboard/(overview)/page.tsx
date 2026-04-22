'use client';

import { lusitana } from "@/src/assets/fonts/fonts";
import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";
import { Button } from "@/src/components/ui/buttons/buttons";
import { useAccounts } from "@/src/context/accountContext";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Page() {
  const { accounts } = useAccounts();

  return (
    <AuthGuard>
      <main className="relative max-w-[1600px] min-h-screen">
        
        {accounts?.length === 0 ? (
          <div className="h-[80vh] glass backdrop-blur-md rounded-[2.5rem] w-full flex flex-col justify-center items-center border border-white/10 shadow-2xl">
            <div className="text-center space-y-6">
              <h2 className={`${lusitana.className} text-2xl opacity-80`}>No accounts found</h2>
              <Button href="/account/add" className="p-4 glass-hover flex items-center gap-2 group">
                <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span>Add your first account</span>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
               <h1 className={`${lusitana.className} font-bold text-2xl mb-5 md:text-3xl tracking-tight`}>
                  Dashboard<span className="text-indigo-500">.</span>
               </h1>
            </div>

            <div className="w-full">
              {/* Main Grid: 6 Columns */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(150px,auto)]">
                
                {/* COLUMN 1 & 2: Financial Overview */}
                <div className="lg:col-span-2 lg:row-span-1">
                  <CardWrapper title="Card Details" />
                </div>
                <div className="lg:col-span-2 lg:row-span-1">
                  <CardWrapper title="Wallet" />
                </div>
                
                {/* COLUMN 5 & 6: Payables (Top Right) */}
                <div className="lg:col-span-2 lg:row-span-3">
                  <CardWrapper title="Payable Accounts, Receipts" />
                </div>

                {/* COLUMN 1 & 2: Transactions (Now Middle-Left) */}
                <div className="lg:col-span-2 lg:row-span-5 h-full">
                  <CardWrapper title="Transactions" />
                </div>

                {/* COLUMN 3 & 4: Monthly Spent (Center) */}
                <div className="lg:col-span-2 lg:row-span-3">
                  <CardWrapper title="Monthly Spent" />
                </div>

                {/* COLUMN 5 & 6: Savings Trend (Bottom Right) */}
                <div className="lg:col-span-2 lg:row-span-3">
                  <CardWrapper title="Savings" />
                </div>

                {/* COLUMN 3 & 4: Remaining space / Future Insights */}
                <div className="lg:col-span-2 lg:row-span-2">
                   <CardWrapper title="Accounts Details" />
                </div>

              </div>
            </div>
          </>
        )}
      </main>
    </AuthGuard>
  );
}
