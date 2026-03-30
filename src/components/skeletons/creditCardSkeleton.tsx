'use client';

import clsx from "clsx";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface CreditCardSkeletonProps {
  parentClass: string;
  skeleton: boolean;
}

export default function CreditCardSkeleton({
  parentClass,
  skeleton,
}: CreditCardSkeletonProps) {
  const path = usePathname();
  const isCardPage = useMemo(() => path.includes("cards"), [path]);

  return (
    <Swiper
      spaceBetween={2}
      slidesPerView={1}
      className="w-full h-fit rounded-xl"
    >
      {[1].map((_, index) => (
        <SwiperSlide key={index}>
          <div
            className={clsx(
              "relative flex flex-col rounded-2xl p-6",
              "glass glass-hover smooth-theme",
              "overflow-hidden",
              parentClass,
              isCardPage ? "mt-6" : "h-full"
            )}
          >
            {/* Glow */}
            <div className="glow glow-indigo -top-10 -right-10"></div>
            <div className="glow glow-purple -bottom-10 -left-10"></div>

            {/* Empty State */}
            {!skeleton && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-sm hover:scale-110 transition-all">
                  Add Card
                </button>
              </div>
            )}

            {/* Card Type Icon */}
            <div className="absolute right-4 top-4 w-12 h-12 rounded-lg skeleton" />

            {/* Card Number */}
            <div className="mt-8">
              <div className="h-5 w-48 rounded-md skeleton" />
            </div>

            {/* Expiry & CVV */}
            <div className="flex justify-between mt-4 text-sm">
              <div className="flex flex-col gap-1">
                <div className="h-3 w-12 rounded-md skeleton" />
                <div className="h-4 w-16 rounded-md skeleton" />
              </div>

              <div className="flex flex-col gap-1 items-end">
                <div className="h-3 w-10 rounded-md skeleton" />
                <div className="h-4 w-12 rounded-md skeleton" />
              </div>
            </div>

            {/* Holder Name */}
            <div className="mt-4">
              <div className="h-4 w-32 rounded-md skeleton" />
            </div>

            {/* Eye Button (⚠️ NO skeleton shimmer here) */}
            <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-gray-300/40 dark:bg-gray-700/40 backdrop-blur-md" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}