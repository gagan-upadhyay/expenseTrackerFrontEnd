// components/Footer.tsx
import Link from 'next/link';
import { FaReact, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full opacity-50 bg-gray-100 py-4 shadow-md">
      <div className="max-w-5xl mx-auto flex flex-col relative md:flex-row items-center justify-between px-4 gap-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <span>🚀 Powered by Next.js & TailwindCSS</span>
          <FaReact className="text-blue-500" />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/about">
            <p className="hover:underline cursor-pointer">About Us</p>
          </Link>
          <Link href="https://github.com/your-repo" target="_blank">
            <FaGithub className="text-gray-800 hover:text-black cursor-pointer" />
          </Link>
        </div>
      </div>
    </footer>
  );
}