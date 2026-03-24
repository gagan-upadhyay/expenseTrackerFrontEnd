// 'use client';
import clsx from "clsx";
import Link from "next/link";


interface RedirectingButtonProps{
    title:string;
    target:string;
    theme:string;
}

export const RedirectingButton = ({title, target, theme}:RedirectingButtonProps)=>{
    
    return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
            <Link href={target}>
                <button className={clsx("px-4 py-2 bg-blue-600 text-sm rounded-lg shadow-md hover:bg-blue-700 transition-all hover:scale-110 ease-in-out duration-500",
                    theme==='light'&&'text-black',
                    theme==='dark' && 'text-white',
                )}>
                    <p>Add {title} details</p>
            </button>
            </Link>
        </div>

    )
}
