import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request:NextRequest){
    const isLoggedIn = request.cookies.get('accessToken')?.value;
    console.log("Value of isLoggedIn from middleware", isLoggedIn);
    if(!isLoggedIn){
        return NextResponse.redirect(new URL('auth/login', request.url))
    }
    return NextResponse.next();
}

export const config={
    matcher:['/dashboard/:path*', '/logout'],

}

