"use server";

import { cookies } from "next/headers";

export async function getUserFromCookie() {
  const cookieStore = await cookies();

  const rawCookie = cookieStore.get("user")?.value; 

  if (!rawCookie) {
    return null;
  }

  try {
   
    const decoded = decodeURIComponent(rawCookie);

    const user = JSON.parse(decoded);

    return user;
  } catch (error) {
    console.error("Failed to parse cookie:", error);
    return null;
  }
}
