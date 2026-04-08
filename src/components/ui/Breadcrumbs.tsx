'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
// import clsx from 'clsx';

const routeNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  wallet: 'Wallet',
  transactions: 'Transactions',
  account: 'Accounts',
  add: 'Add',
  settings: 'Settings',
  user: 'User',
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  // ❌ don't show on dashboard root
  if (pathname === '/dashboard') return null;

  const segments = pathname.split('/').filter(Boolean);

  let path = '';

  const breadcrumbs = segments.map((segment) => {
    path += `/${segment}`;

    return {
      name: routeNameMap[segment] || segment,
      href: path,
    };
  });

  return (
    <div className="relative w-[70%] left-15 ">
      <div className="glass glass-light px-4 py-2 rounded-xl flex items-center gap-2 text-sm overflow-x-auto">

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div key={crumb.href} className="flex items-center gap-2 whitespace-nowrap">

              {!isLast ? (
                <Link
                  href={crumb.href}
                  className="opacity-70 hover:opacity-100 transition"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span className="font-medium text-indigo-500">
                  {crumb.name}
                </span>
              )}

              {!isLast && <span className="opacity-50">/</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}