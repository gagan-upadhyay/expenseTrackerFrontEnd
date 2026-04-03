// import clsx from "clsx";
// import { FaCcVisa } from "react-icons/fa";
// import { Button } from "../ui/buttons/buttons";

// export default function BlurCard(){
//     return (
//         <>
//         <div
//         className={clsx(
//         "relative flex flex-col rounded-2xl p-6", // ✅ IMPORTANT
//         "glass glass-hover smooth-theme",        // ✅ IMPORTANT
//         "overflow-hidden mb-4",
//         "min-w-[280px] flex-shrink-0",
//         "backdrop-blur-md blur-xs select-none"
//         )}
//         >
//             {/* Glow */}
//             <div className="glow glow-indigo -top-10 -right-10"></div>
//             <div className="glow glow-purple -bottom-10 -left-10"></div>

//             {/* Card Type */}
//             <div className="absolute right-4 top-4">
//                 <FaCcVisa className="lg:w-12 lg:h-12 w-10 h-10" />
//             </div>

//             {/* Card Number */}
//             <div className="mt-8 text-sm lg:text-xl tracking-widest transition-all duration-500">
//                     4521 1212 3232 1212
//             </div>

//             {/* Expiry & CVV */}
//             <div className="flex justify-between mt-4 text-sm">
//                 <div>
//                 <span className="block opacity-70">Expiry</span>
//                     12
//                 </div>
//                 <div>
//                 <span className="block opacity-70">CVV</span>
//                 ***
//                 </div>
//             </div>

//             {/* Holder */}
//             <div className=" mt-4 text-sm flex justify-between lg:text-lg">
//                 <span>XXXX</span>
//                 <span>XXXXXX</span>
//             </div>
            
//         </div>
//         </>
//     )
// }

import clsx from "clsx";
import { FaCcVisa } from "react-icons/fa";
import { Button } from "../ui/buttons/buttons";
import { PlusIcon } from "@heroicons/react/24/outline"; // Optional for better UI
import { useRouter } from "next/navigation";

export default function BlurCard({ onClick }: { onClick?: () => void }) {
    const router = useRouter();
    return (
        <div className="relative group " onClick={onClick}>
             <div className="glow glow-indigo -top-10 -right-10"></div>
            <div className="glow glow-purple -bottom-10 -left-10"></div>
            {/* 1. The Blurred Card Background */}
            <div
                className={clsx(
                    "relative flex flex-col rounded-2xl p-6 transition-all duration-500",
                    "glass glass-hover smooth-theme overflow-hidden mb-4",
                    "min-w-[280px] flex-shrink-0 select-none",
                    "blur-[2px] opacity-60 group-hover:opacity-40" // Applied blur here
                )}
            >
                {/* Glow Effects */}
                <div className="glow glow-indigo -top-10 -right-10"></div>
                <div className="glow glow-purple -bottom-10 -left-10"></div>

                <div className="absolute right-4 top-4">
                    <FaCcVisa className="lg:w-12 lg:h-12 w-10 h-10" />
                </div>

                <div className="mt-8 text-sm lg:text-xl tracking-widest">
                    4521 1212 3232 1212
                </div>

                <div className="flex justify-between mt-4 text-sm">
                    <div><span className="block opacity-70 text-[10px]">Expiry</span>12 / 28</div>
                    <div><span className="block opacity-70 text-[10px]">CVV</span>***</div>
                </div>

                <div className="mt-4 text-sm flex justify-between lg:text-lg">
                    <span>HOLDER NAME</span>
                    <span>PRIMARY</span>
                </div>
            </div>

            {/* 2. The Clear Button (Positioned Over the Blur) */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <Button onClick={()=>router.push('/dashboard')}
                    className="flex items-center gap-2 px-6 py-2 shadow-2xl transition-transform group-hover:scale-110 "
                >
                    <PlusIcon className="w-4 h-4 font-bold" />
                    <span className="font-semibold ">Add New Card</span>
                </Button>
            </div>
        </div>
    );
}
