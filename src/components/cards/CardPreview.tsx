import clsx from "clsx";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa";
import Image from "next/image";
import Rupay from '../../../public/RuPay.svg';
import { CardDetails } from "@/src/utils/definitions";

export default function CardPreview({ card }: { card: CardDetails }) {
    const expiry = `${String(card.expiry_month).padStart(2, '0')}/${card.expiry_year}`;
    const brandLower = (card.brand || "").toLowerCase();
    console.log('Value of card from addCard:', card);

    return (
        <div
            className={clsx(
            "relative flex flex-col rounded-2xl p-6", // ✅ IMPORTANT
            "glass glass-hover smooth-theme",        // ✅ IMPORTANT
            "overflow-hidden mb-4",
            )}
            >
            {/* Glow */}
            <div className="glow glow-indigo -top-10 -right-10"></div>
            <div className="glow glow-purple -bottom-10 -left-10"></div>

            {/* Card Type */}
            <div className="absolute right-4 top-4">
                {brandLower === 'visa' ? (
                <FaCcVisa className="lg:w-12 lg:h-12 w-10 h-10" />
                ) : brandLower === 'mastercard' ? (
                <FaCcMastercard className="w-12 h-12" />
                ) : brandLower === 'rupay' ? (
                <Image className="w-12 h-12" src={Rupay} alt="Rupay" />
                ) : null}
            </div>

            {/* Card Number */}
            <div className="mt-8 text-sm lg:text-xl tracking-widest transition-all duration-500">
                    {card.cardnumber}
            </div>

            {/* Expiry & CVV */}
            <div className="flex justify-between mt-4 text-sm">
                <div>
                <span className="block opacity-70">Expiry</span>
                    {expiry}
                </div>
                <div>
                <span className="block opacity-70">CVV</span>
                {card.cvv ?? "***"}
                </div>
            </div>

            {/* Holder */}
            <div className=" mt-4 text-sm flex justify-between lg:text-lg">
                <span>{card.holder_name}</span>
                <span>{card.type}</span>
            </div>
        </div>
    )
}