// import clsx from 'clsx';
// import Link from 'next/link';
// import React from 'react';


// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
// {
//     children:React.ReactNode;
//     href:string;
//     className?:string;
//     disabled?:boolean;
// }

// export function Button({children, disabled, className,href, ...rest}:ButtonProps){

//     const baseClass = " rounded-xl transition-all  duration-400";
//     const variantClass = "glass glass-hover text-sm font-medium";

//     const classes = clsx(
//         className,
//         baseClass, 
//         variantClass,
//         disabled?'cursor-not-allowed disabled':''
//     );
//     return(
//         href ==""?<button className={classes} {...rest}>{children}</button>:
//         <Link href={href}>
//             <button className={classes} {...rest}>{children}</button>
//         </Link>
//     )    
// }

'use client';

import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
}

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    children,
    className,
    disabled,
    loading,
    variant = 'primary',
    ...rest
  } = props;

  const baseClass =
    "rounded-xl px-4 py-2 transition-all duration-300 flex items-center justify-center gap-2";

  const variantClass = {
    primary:
      "glass glass-hover",
    secondary:
      "glass-light hover:scale-[1.02]",
    ghost:
      "hover:bg-black/5 dark:hover:bg-white/10",
  };

  const stateClass = clsx(
    disabled && "opacity-50 cursor-not-allowed",
    loading && "cursor-wait"
  );

  const classes = clsx(
    baseClass,
    variantClass[variant],
    stateClass,
    className
  );

  const content = (
    <>
      {loading && (
        <span className="w-4 h-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </>
  );

  // 🔥 LINK VERSION
  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  // 🔥 BUTTON VERSION
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}