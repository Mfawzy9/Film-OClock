import { auth } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import CryptoJS from "crypto-js";

// Session management API
export async function GET() {
  const cookieStore = await cookies();
  try {
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
      },
    });
  } catch (error) {
    console.error("Session verification failed:", error);
    return NextResponse.json(
      { isAuthenticated: false, error: "Session verification failed" },
      { status: 401 },
    );
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  try {
    const { idToken, email, password, rememberMe } = await request.json();

    if (rememberMe && email && password) {
      const encryptedEmail = CryptoJS.AES.encrypt(
        email,
        "SECRET_KEY",
      ).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        "SECRET_KEY",
      ).toString();

      cookieStore.set("email", encryptedEmail);
      cookieStore.set("password", encryptedPassword);
    }

    if (!rememberMe && email && password) {
      cookieStore.delete("email");
      cookieStore.delete("password");
    }

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    const response = NextResponse.json({ success: true }, { status: 201 });

    cookieStore.set({
      name: "session",
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Failed to create session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  try {
    const response = NextResponse.json({ success: true }, { status: 200 });

    cookieStore.delete("session");
    return response;
  } catch (error) {
    console.error("Failed to logout:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
