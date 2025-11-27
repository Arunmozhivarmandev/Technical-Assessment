"use server"

import { cookies } from "next/headers"

export async function loginAction(token: string, user: any) {
    const cookieStore = await cookies()
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookieStore.set("user", JSON.stringify(user), {
        httpOnly: false, // user can be normal cookie
        path: "/",
    })

    return true
}

export async function logoutAction() {
    const cookieStore = await cookies()

    cookieStore.delete("token")
    cookieStore.delete("user")
    return true
}
