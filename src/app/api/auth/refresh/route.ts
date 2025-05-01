import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import admin from "firebase-admin";

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: "No session token provided" },
      { status: 401 },
    );
  }

  try {
    // Verify the session cookie
    const decodedClaims = await admin
      .auth()
      .verifySessionCookie(sessionToken, true /* checkRevoked */);

    // Get the user to check if custom claims need to be refreshed
    await admin.auth().getUser(decodedClaims.uid);

    // Create a new session cookie with extended expiration
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const newSessionCookie = await admin
      .auth()
      .createSessionCookie(decodedClaims.token, { expiresIn });

    const response = NextResponse.json({
      success: true,
      token: newSessionCookie,
      expiresIn,
    });

    // Set the new cookie in the response
    response.cookies.set({
      name: "session",
      value: newSessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error refreshing token:", error);

    if (error instanceof Error) {
      if (error.message.includes("auth/session-cookie-expired")) {
        return NextResponse.json(
          { error: "Session expired. Please log in again." },
          { status: 401 },
        );
      }
      if (error.message.includes("auth/session-cookie-revoked")) {
        return NextResponse.json(
          { error: "Session revoked. Please log in again." },
          { status: 401 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to refresh session. Please log in again." },
      { status: 401 },
    );
  }
}
