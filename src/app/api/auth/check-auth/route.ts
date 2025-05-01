import { auth } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false });
    }

    await auth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ isAuthenticated: true });
  } catch (error) {
    console.error("Session verification failed:", error);
    return NextResponse.json({ isAuthenticated: false });
  }
}
