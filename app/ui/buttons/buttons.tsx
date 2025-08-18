import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
{
    children:React.ReactNode;
    href:string;
    className?:string;
}

export function Button({children, className,href, ...rest}:ButtonProps){

    const baseClass = "flex md:h-10 h-6 items-center rounded-lg px-4 text-xs md:text-sm font-medium transition-colors";
    const variantClass = "bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600";

    const classes = clsx(
        className,
        baseClass, 
        variantClass,
        
    );
    return(
        href ==""?<button className={classes} {...rest}>{children}</button>:
        <Link href={href}>
            <button className={classes} {...rest}>{children}</button>
        </Link>
    )    
}