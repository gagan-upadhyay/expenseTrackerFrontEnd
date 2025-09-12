// components/Footer.tsx
import Link from 'next/link';
import { FaReact, FaGithub } from 'react-icons/fa';
import { useTheme } from '@/src/context/themeContext';

export default function Footer() {
  const {theme} = useTheme();
  return (
    <footer className={`${theme==='light'?'bg-gray-100 shadow-[0_-1px_6px_-2px_rgba(18,18,20,1)]':'bg-neutral-900 shadow-[0_-1px_6px_-1px_rgba(229,231,235,1)]'} opacity-80 w-full py-4 `}>
      <div className="max-w-5xl mx-auto flex flex-col relative md:flex-row items-center justify-between px-4 gap-2 text-sm text-gray-700">
        <div className={`${theme==='light'?'text-gray-900':'text-neutral-200'} flex items-center gap-2`}>
          <span>🚀 Powered by Next.js & TailwindCSS</span>
          <FaReact className={`${theme==='light'?'text-gray-900':'text-neutral-200'}`} />
        </div>
        <div className={`${theme==='light'?'text-gray-900':'text-neutral-200'} flex items-center gap-4`}>
          <Link href="/about">
            <p className="hover:underline cursor-pointer">About Us</p>
          </Link>
          <Link href="https://github.com/gagan-upadhyay/expenseTrackerFrontEnd">
            <FaGithub className={`${theme==='light'?'text-gray-900':'text-neutral-200'} hover:text-black cursor-pointer`} />
          </Link>
        </div>
      </div>
    </footer>
  );
}