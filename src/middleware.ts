import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const AUTH_ROUTES = ["/auth"];
const PROTECTED_ROUTES = ["/library", "/profile", "/watchedShows"];
const supportedLocales = ["en", "ar"];

export async function middleware(request: NextRequest) {
  // Skip middleware for non-page routes and if already processed
  if (
    request.headers.get("x-middleware-cache") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Handle internationalization first
  const response = intlMiddleware(request);

  const { pathname } = request.nextUrl;

  if (pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  const pathLocale = pathname.split("/")[1];
  const locale = supportedLocales.includes(pathLocale)
    ? pathLocale
    : request.cookies.get("NEXT_LOCALE")?.value || "en";

  // Skip if navigating to same page
  const referer = request.headers.get("referer");
  if (referer && new URL(referer).pathname === pathname) {
    return response;
  }

  // Get path without locale for matching
  const currentPath = pathname.startsWith(`/${locale}`)
    ? pathname.slice(locale.length + 1)
    : pathname;

  // Check if current path needs protection
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    currentPath.startsWith(route),
  );
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    currentPath.startsWith(route),
  );

  if (!isAuthRoute && !isProtectedRoute) {
    return response;
  }

  const sessionToken = request.cookies.get("session")?.value;

  // Handle auth routes (login/signup)
  if (isAuthRoute && sessionToken) {
    try {
      // Cache verification for 5 minutes
      const authCheck = await fetch(
        `${request.nextUrl.origin}/api/auth/verify`,
        {
          headers: { Cookie: `session=${sessionToken}` },
          next: { revalidate: 300 }, // 5 minutes cache
        },
      );

      if (authCheck.ok) {
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
    }
    return response;
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!sessionToken) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login?reason=session-expired`, request.url),
      );
    }

    try {
      // Cache verification for 5 minutes
      const authCheck = await fetch(
        `${request.nextUrl.origin}/api/auth/verify`,
        {
          headers: { Cookie: `session=${sessionToken}` },
          next: { revalidate: 300 }, // 5 minutes cache
        },
      );

      if (!authCheck.ok) {
        const refreshResponse = await fetch(
          `${request.nextUrl.origin}/api/auth/refresh`,
          {
            headers: { Cookie: `session=${sessionToken}` },
          },
        );

        if (refreshResponse.ok) {
          const newToken = await refreshResponse.json();
          const newResponse = NextResponse.next();
          newResponse.cookies.set("session", newToken.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: newToken.expiresIn,
          });
          return newResponse;
        }

        const redirectResponse = NextResponse.redirect(
          new URL(`/${locale}/auth/login`, request.url),
        );
        redirectResponse.cookies.delete("session");
        return redirectResponse;
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|sitemap.xml|robots.txt|favicon.ico|.*\\..*).*)",
  ],
};
