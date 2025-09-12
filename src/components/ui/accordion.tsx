// Accordion.tsx
'use client';
import { useState } from 'react';
import clsx from 'clsx';
import {ChevronUpIcon } from '@heroicons/react/16/solid';

export default function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
    const upIcon = <ChevronUpIcon className='w-7'/>
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={clsx(
        "w-3/4 px-4 py-2 items-center justify-center border rounded-xl transform-all ease-in-out duration-1500",
        isOpen?'':'hover:scale-102'
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx('w-full text-md md:text-xl py-2  font-medium  flex justify-between items-center transition-transform duration-100 ease-in-out',
            // isOpen ? '':'',
        )}

      >
        <span>{isOpen ? '':title}</span>
        <span className={clsx(
            'transition-all ease-in-out duration-200',
            isOpen?'rotate-0 scale 100':'rotate-180 scale-110'
        )}>{upIcon}</span>
      </button>
      {isOpen && <div className="px-4 flex flex-col py-2">{children}</div>}
    </div>
  );
}