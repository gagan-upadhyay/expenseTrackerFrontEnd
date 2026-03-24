import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
{
    children:React.ReactNode;
    href:string;
    className?:string;
    disabled?:boolean;
}

export function Button({children, disabled, className,href, ...rest}:ButtonProps){

    const baseClass = "inline-flex relative items-center rounded-xl transition-all ease-in-out duration-400";
    const variantClass = "bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600";

    const classes = clsx(
        className,
        baseClass, 
        variantClass,
        disabled?'cursor-not-allowed disabled':''
    );
    return(
        href ==""?<button className={classes} {...rest}>{children}</button>:
        <Link href={href}>
            <button className={classes} {...rest}>{children}</button>
        </Link>
    )    
}