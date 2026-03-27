import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/auth/login", "/auth/register"];
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const shouldBypassEdgeAuth = (request: NextRequest): boolean => {
  if (!BACKEND_URL) return false;

  try {
    // When backend sets cookies with COOKIE_DOMAIN (e.g. .example.com), the browser sends them to the dashboard too —
    // middleware can enforce auth. Do not skip in that case.
    const sharedCookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.trim();
    if (sharedCookieDomain) return false;

    const backendHost = new URL(BACKEND_URL).hostname;
    return backendHost !== request.nextUrl.hostname;
  } catch {
    return false;
  }
};

export function middleware(request: NextRequest) {
  if (shouldBypassEdgeAuth(request)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("adminAccessToken")?.value;
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isProtectedRoute = isDashboardRoute;

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};

