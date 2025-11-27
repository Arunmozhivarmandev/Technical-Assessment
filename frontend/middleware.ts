import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getTokenFromCookies } from './app/actions/getToken'
import { getUserFromCookie } from './app/actions/getUser'



export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const token = await getTokenFromCookies()

    // If no token, redirect to login
    if (!token) {
        const loginUrl = new URL('/login', req.url)
        return NextResponse.redirect(loginUrl)
    }

    const user = await getUserFromCookie()


    // Protect admin-only pages
    const isAdminPage =
        pathname.includes("/dashboard/employees/add") ||
        pathname.includes("/dashboard/employees/") && pathname.includes("/edit");

    if (isAdminPage && user?.role !== "admin") {
        const url = new URL("/unauthorized", req.url);
        return NextResponse.rewrite(url);
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*']
}
