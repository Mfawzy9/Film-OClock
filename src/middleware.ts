import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

async function verifySession(
  sessionToken: string,
  origin: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${origin}/api/auth/verify`, {
      headers: { Cookie: `session=${sessionToken}` },
      next: { revalidate: 300 }, // Cache for 5 mins
    });
    return res.ok;
  } catch (error) {
    console.error("Session verification failed:", error);
    return false;
  }
}

const intlMiddleware = createMiddleware(routing);

const AUTH_ROUTES = ["/auth"];
const PROTECTED_ROUTES = ["/library", "/profile", "/watchedShows"];
const supportedLocales = ["en", "ar"];

export async function middleware(request: NextRequest) {
  if (
    request.headers.get("x-middleware-cache") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // i18n middleware first
  const response = intlMiddleware(request);
  response.headers.set("x-current-pathname", request.nextUrl.pathname);

  const { pathname } = request.nextUrl;

  if (pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  const pathLocale = pathname.split("/")[1];
  const locale = supportedLocales.includes(pathLocale)
    ? pathLocale
    : request.cookies.get("NEXT_LOCALE")?.value || "en";

  const referer = request.headers.get("referer");
  if (referer && new URL(referer).pathname === pathname) {
    return response;
  }

  const currentPath = pathname.startsWith(`/${locale}`)
    ? pathname.slice(locale.length + 1)
    : pathname;

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
  const isLoggedOut = request.cookies.get("loggedOut")?.value === "true";

  // Auth routes: redirect if already logged in
  if (isAuthRoute && sessionToken && !isLoggedOut) {
    const isValid = await verifySession(sessionToken, request.nextUrl.origin);
    if (isValid) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    return response;
  }

  // Protected routes: block if not logged in
  if (isProtectedRoute) {
    if (!sessionToken) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login?reason=session-expired`, request.url),
      );
    }

    const isValid = await verifySession(sessionToken, request.nextUrl.origin);

    if (!isValid) {
      try {
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
      } catch (error) {
        console.error("Auth refresh failed:", error);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|sitemap.xml|robots.txt|favicon.ico|.*\\..*).*)",
  ],
};
