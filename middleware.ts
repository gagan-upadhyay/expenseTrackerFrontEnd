import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.webmanifest (PWA manifest)
     * - sw.js (service worker)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|.*\\..*).*)',
  ],
};