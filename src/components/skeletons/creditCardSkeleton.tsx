import { useTheme } from "@/src/context/themeContext";
import clsx from "clsx";
// import Image from "next/image";

interface CreditCardProps{
  parentClass:string;
  skeleton:boolean;
}



export default function CreditCardSkeleton({parentClass, skeleton}:CreditCardProps){
  const transitionClass = 'transition-all duration-500 ease-in-out'
  const {theme} = useTheme();
  return(
    <div className={clsx("w-auto rounded-xl p-5 shadow-xl relative border-1 focus:outline-none focus:ring-2", 
      parentClass,
      )}>
      {!skeleton && (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <button className={clsx("px-4 py-2 bg-blue-600  text-sm rounded-lg shadow-md hover:bg-blue-700 hover:scale-110",
          transitionClass,
          theme==='light'&&'text-black',
          theme==='dark' && 'text-white',
        )}>
          Add Account details
        </button>
      </div>
      )}
      <div className={clsx(!skeleton &&theme==='light'? 'opacity-100 bg-dark':'opacity-50','animate-pulse')}>
        {/* Card Type */}
        <div className={clsx("absolute right-4 top-1", transitionClass)}>
          <div className="lg:w-12 lg:h-12 w-10 h-10 bg-gray-300/40 rounded-md"></div>
        </div>

        {/* Card Number */}
        <div className={clsx(' md:ml-0 sm:ml-[-10] mt-8',transitionClass)}>
          <div className="w-[65%] h-4 bg-gray-300/40 rounded-md"></div>
        </div>
        {/* Expiry & CVV */}
        <div className={clsx("flex justify-between mt-4", transitionClass)}>
        <div className="flex flex-col ">
            <div className="w-10 h-5 mb-1 bg-gray-300/40 rounded-md"></div>
          <div className="w-10 h-5 bg-gray-300/40 rounded-md"></div>
        </div>
          {/* CVV */}
          <div className="mb-3">
            <div className="md:w-10 md:h-5 w-7 h-3 mb-1 bg-gray-300/40 rounded-md"></div>
            <div className="w-10 h-5 bg-gray-300/40 rounded-md"></div>
          </div>
        </div>

        {/* Card Holder */}
        <div className="mt-4">
          <div className="h-5 w-20 bg-gray-300/40 rounded-md"></div>
        </div>

        {/* Eye Button */}
        <div className="absolute lg:bottom-2 bottom-3 lg:right-4 right-2 rounded-full lg:w-9 lg:h-9 w-5 h-5 bg-gray-300/40"></div>

      </div>
    </div>
  )
}