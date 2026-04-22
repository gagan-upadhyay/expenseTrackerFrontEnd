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

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  ariaLabel?: string;
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
    size = 'md',
    fullWidth = false,
    ariaLabel,
    ...rest
  } = props;

  // Base styles
  const baseClass = clsx(
    "rounded-lg px-4 py-2 transition-all duration-200 flex items-center justify-center gap-2",
    "font-medium text-sm",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
    "dark:focus:ring-offset-slate-900",
    fullWidth && "w-full"
  );

  // Size variants
  const sizeClass = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-xl",
  };

  // Color variants with theme support
  const variantClass = {
    primary: clsx(
      "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500",
      "text-white dark:text-white",
      "shadow-sm hover:shadow-md",
      "active:scale-95"
    ),
    secondary: clsx(
      "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600",
      "text-slate-900 dark:text-white",
      "active:scale-95"
    ),
    ghost: clsx(
      "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800",
      "text-slate-700 dark:text-slate-300",
      "border border-slate-200 dark:border-slate-700",
      "hover:border-slate-300 dark:hover:border-slate-600"
    ),
    danger: clsx(
      "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
      "text-white dark:text-white",
      "shadow-sm hover:shadow-md",
      "active:scale-95"
    ),
    success: clsx(
      "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600",
      "text-white dark:text-white",
      "shadow-sm hover:shadow-md",
      "active:scale-95"
    ),
  };

  // State styles
  const stateClass = clsx(
    disabled && "opacity-60 cursor-not-allowed pointer-events-none",
    loading && "opacity-80 cursor-wait"
  );

  const classes = clsx(
    baseClass,
    sizeClass[size],
    variantClass[variant],
    stateClass,
    className
  );

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </>
  );

  // Link version
  if ('href' in props && props.href) {
    return (
      <Link 
        href={props.href} 
        className={classes}
        {...(ariaLabel && { 'aria-label': ariaLabel })}
      >
        {content}
      </Link>
    );
  }

  // Button version
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={disabled}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}