import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from 'next-auth/middleware'

export async function middleware(request: NextRequest) {
    const token = await getToken({req: request});
    const url = request.nextUrl;

    if(!token) {
        NextResponse.redirect(new URL('/', request.url));
    }

    if(token && (
        url.pathname.startsWith("/auth/login") ||
        url.pathname.startsWith("/auth/register")
    )) {
        NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    macher: [
        '/auth/login',
        '/auth/register',
        '/dashboard',
        '/products/:path*',
        '/categories',
        '/orders',
        '/settings',
        '/upload/:path*',
    ]
}