import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log('[MIDDLEWARE] pathname:', pathname);

  // Bypass auth for PWA assets and public resources
  if (
    pathname === '/manifest.webmanifest' ||
    pathname === '/service-worker.js' ||
    pathname === '/sw.js' ||
    pathname === '/offline.html' ||
    pathname.startsWith('/workbox-') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico'
  ) {
    console.log('[MIDDLEWARE] bypassing auth for:', pathname);
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const decoded = jwtDecode<{ exp: number }>(accessToken);
    const isValid = decoded.exp * 1000 > Date.now();
    if (!isValid) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/transactions/:path*',
    '/wallet/:path*',
  ],
};