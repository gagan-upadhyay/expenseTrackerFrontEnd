'use client';

import { useTheme } from "@/src/context/themeContext";
import { FaCcVisa } from "react-icons/fa";

type CardProps={
    title:string;
}

export default function CardWrapper({title}:CardProps){
    const {theme}= useTheme();
    
    return (
        <div className={`${theme==='light'?'border-blue-200 text-gray-900':'text-neutral-300 border-gray-800'} border rounded-lg p-4 shadow-md`}>
            <h3 className="text-lg text-center font-semibold"> {title} </h3>
            
            <FaCcVisa size={60} color={theme==='light' ? 'neutral-700':'gray-400'} />


        </div>
    )
}