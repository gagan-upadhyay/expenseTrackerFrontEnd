// Accordion.tsx
'use client';
import { useState } from 'react';
import clsx from 'clsx';
import {ChevronUpIcon } from '@heroicons/react/16/solid';

export default function Accordion({ title, children, isOpen, onToggle }: { title: string; children: React.ReactNode; isOpen?: boolean; onToggle?: () => void }) {
    const upIcon = <ChevronUpIcon className='w-7'/>
  const [internalOpen, setInternalOpen] = useState(false);

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const toggle = onToggle || (() => setInternalOpen(!internalOpen));

  return (
    <div className={clsx(
        "w-3/4 px-4 py-2 items-center mb-4 justify-center border rounded-xl transform-all ease-in-out duration-1500",
        open?'':'hover:scale-102'
    )}>
      <button
        onClick={toggle}
        className={clsx('w-full text-md md:text-xl py-2  font-medium  flex justify-between items-center transition-transform duration-100 ease-in-out',
            // open ? '':'',
        )}

      >
        <span>{open ? '':title}</span>
        <span className={clsx(
            'transition-all ease-in-out duration-200',
            open?'rotate-0 scale 100':'rotate-180 scale-110'
        )}>{upIcon}</span>
      </button>
      {open && <div className="px-4 flex flex-col py-2">{children}</div>}
    </div>
  );
}