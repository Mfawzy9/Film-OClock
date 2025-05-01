import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/firebase/admin";

export async function GET() {
  const cookieStore = await cookies();
  try {
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    await auth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json(
      { valid: true, message: "token is valid" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Session verification failed:", error);
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
