
'use client';
interface CreditCardProps {
  parentClass:string;
  transitionClass?:string;  
}

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


export default function CreditCard({ parentClass, transitionClass = '' }: CreditCardProps) {
  const [showSensitive, setShowSensitive] = useState(false);
  
    // console.log("va;lue of parentClass from creditCard:\n", parentClass);
  const toggleVisibility = () => setShowSensitive(!showSensitive);
  // hide sensitive info when user navigates slides
  const handleSlideChange = () => setShowSensitive(false);
  const {cards, loading} = useAccounts();
  console.info(`value of cards from creditcard.tsx:${cards}`)

  return (
    <>
    {
      loading?
      
      <CreditCardSkeleton parentClass={parentClass} skeleton={true}/>
      
      : cards && cards.length > 0 ?
      <Swiper spaceBetween={2} slidesPerView={1} className="w-full" onSlideChange={handleSlideChange}>
        {cards.map((card, index) => (
          <SwiperSlide  key={card.id || index}>
            
            <div className={clsx("w-auto rounded-xl p-5 shadow-xl relative border-1 focus:outline-none focus:ring-2",             
              parentClass)}>
              {/* Card Type */}
              <div className={clsx("absolute right-4 top-1 font-bold", transitionClass)}>
                {
                  card?.brand ==='Visa'? <FaCcVisa className="lg:w-12 lg:h-12 w-10 h-10 "/>:card?.brand ==='Mastercard'?<FaCcMastercard className="w-12 h-12"/>:card?.brand==='Rupay'? <Image className='w-15 h-15' src={Rupay} alt='Rupay'/>    
                  : null
                }
              </div>

              {/* Card Number */}
              <div className={clsx('lg:text-xl tracking-wide md:ml-0 sm:ml-[-10] lg:tracking-widest mt-8 text-sm',transitionClass)}>
                {showSensitive ? card?.cardnumber?card?.cardnumber:"xxxx xxxx xxxx xxxx" : "**** **** **** ****"}
              </div>
              {/* Expiry & CVV */}
              <div className={clsx("flex justify-between mt-4 text-sm", transitionClass)}>
                <div>
                  <span className="block">Expiry</span>
                
                {showSensitive
                  ? `${card?.expiry_month?.toString().padStart(2, '0')}/${card?.expiry_year}`
                  : "**/**"}
                </div>
                <div>
                  <span className="block">CVV</span>
                  {showSensitive ? '123': "***"}
                </div>
              </div>

              {/* Card Holder */}
              <div className="mt-4 text-sm lg:text-lg">{card?.holder_name}</div>

              {/* Eye Button */}
              <button
                onClick={toggleVisibility}
                className="absolute bottom-4 right-4 bg-gray-400/20 text-indigo-600 rounded-full p-2"
              >
                {showSensitive ? (
                  <EyeIcon className="lg:w-5 w-3 h-3 lg:h-5" />
                ) : (
                  <EyeSlashIcon className="lg:w-5 w-3 h-3 lg:h-5" />
                )}
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      :
      <CreditCardSkeleton parentClass={parentClass} skeleton={false}/>
    }
    </>
  );
}
