import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import CryptoJS from "crypto-js";

// Handle email and password storage in cookies

export async function GET() {
  const cookieStore = await cookies();
  const email = cookieStore.get("email")?.value;
  const password = cookieStore.get("password")?.value;

  const decryptedEmail = email
    ? CryptoJS.AES.decrypt(email, "SECRET_KEY").toString(CryptoJS.enc.Utf8)
    : null;
  const decryptedPassword = password
    ? CryptoJS.AES.decrypt(password, "SECRET_KEY").toString(CryptoJS.enc.Utf8)
    : null;

  if (email && password) {
    return NextResponse.json(
      { email: decryptedEmail, password: decryptedPassword },
      { status: 200 },
    );
  } else {
    return NextResponse.json({ email: null, password: null }, { status: 200 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  try {
    const { email, password, rememberMe } = await request.json();

    // Set expiration time for the cookies (if "Remember me" is checked)
    const expiresIn = rememberMe ? 60 * 60 * 24 * 5 * 1000 : undefined; // 5 days if "Remember me" is checked

    // Save email and password in cookies
    cookieStore.set({
      name: "email",
      value: email,
      maxAge: expiresIn, // Will persist for 5 days if checked
      expires: expiresIn ? new Date(Date.now() + expiresIn) : undefined, // Set expiration if "Remember me" is checked
      path: "/",
      sameSite: "lax",
    });

    cookieStore.set({
      name: "password",
      value: password,
      maxAge: expiresIn, // Same expiration as email
      expires: expiresIn ? new Date(Date.now() + expiresIn) : undefined,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save email and password:", error);
    return NextResponse.json(
      { error: "Failed to save email and password" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  try {
    // Delete email and password cookies
    cookieStore.delete("email");
    cookieStore.delete("password");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete email and password:", error);
    return NextResponse.json(
      { error: "Failed to delete email and password" },
      { status: 500 },
    );
  }
}
