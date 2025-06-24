// app/api/delete-account/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth, dbAdmin } from "@/lib/firebase/admin";

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ✅ 1. Verify session cookie
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decoded.uid;

    // 🔥 2. Delete Firestore doc and Firebase Auth account
    await Promise.all([
      dbAdmin.recursiveDelete(dbAdmin.doc(`users/${userId}`)),
      auth.deleteUser(userId),
    ]);

    // ✅ 3. Clear session
    cookieStore.delete("session");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
