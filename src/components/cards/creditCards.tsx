'use client';

import Rupay from '../../../public/RuPay.svg';
import Image from 'next/image';
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa";
import clsx from 'clsx';
import { useAccounts } from '@/src/context/accountContext';
import CreditCardSkeleton from '../skeletons/creditCardSkeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import BlurCard from './addCardBlur';

interface CreditCardProps {
  parentClass: string;
}

export default function CreditCard({ parentClass }: CreditCardProps) {
  const [showSensitive, setShowSensitive] = useState(false);
  const { cards, loading } = useAccounts();

  const toggleVisibility = () => setShowSensitive(prev => !prev);
  const handleSlideChange = () => setShowSensitive(false);

  if (loading) {
    return <CreditCardSkeleton parentClass={parentClass} skeleton />;
  }

  if (!cards || cards.length === 0) {
    return <BlurCard/>
  }

  return (
    <Swiper
      spaceBetween={2}
      slidesPerView={1}
      className="w-full h-fit rounded-xl glass"
      onSlideChange={handleSlideChange}
    >
      {cards.map((card, index) => (
        <SwiperSlide key={index}>
          
          {/* ✅ MATCH WALLET STRUCTURE */}
          <div
            className={clsx(
              "relative flex flex-col rounded-2xl p-6", // ✅ IMPORTANT
              "glass glass-hover smooth-theme",        // ✅ IMPORTANT
              "overflow-hidden",
              parentClass
            )}
          >
            {/* Glow */}
            <div className="glow glow-indigo -top-10 -right-10"></div>
            <div className="glow glow-purple -bottom-10 -left-10"></div>

            {/* Card Type */}
            <div className="absolute right-4 top-4">
              {card?.brand === 'Visa' ? (
                <FaCcVisa className="lg:w-12 lg:h-12 w-10 h-10" />
              ) : card?.brand === 'Mastercard' ? (
                <FaCcMastercard className="w-12 h-12" />
              ) : card?.brand === 'Rupay' ? (
                <Image className="w-12 h-12" src={Rupay} alt="Rupay" />
              ) : null}
            </div>

            {/* Card Number */}
            <div className="mt-8 text-sm lg:text-xl tracking-widest transition-all duration-500">
              {showSensitive
                ? card?.cardnumber || "xxxx xxxx xxxx xxxx"
                : "**** **** **** ****"}
            </div>

            {/* Expiry & CVV */}
            <div className="flex justify-between mt-4 text-sm">
              <div>
                <span className="block opacity-70">Expiry</span>
                {showSensitive
                  ? `${card?.expiry_month?.toString().padStart(2, '0')}/${card?.expiry_year}`
                  : "**/**"}
              </div>
              <div>
                <span className="block opacity-70">CVV</span>
                {showSensitive ? '123' : "***"}
              </div>
            </div>

            {/* Holder */}
            <div className="mt-4 text-sm lg:text-lg">
              {card?.holder_name}
            </div>

            {/* ✅ FIXED BUTTON (same as wallet) */}
            <button
              onClick={toggleVisibility}
              className={clsx(
                "absolute bottom-4 right-4 p-2 rounded-full",
                "glass",
                "hover:scale-110 active:scale-95 transition-all duration-300"
              )}
            >
              {showSensitive ? (
                <EyeIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              ) : (
                <EyeSlashIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              )}
            </button>
          </div>

        </SwiperSlide>
      ))}
    </Swiper>
  );
}