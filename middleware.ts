import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/auth/login", "/auth/register"];
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const shouldBypassEdgeAuth = (request: NextRequest): boolean => {
  if (!BACKEND_URL) return false;

  try {
    // API and dashboard are usually on different hosts. Cookies are set for the API host unless COOKIE_DOMAIN is set
    // on the backend; in that split setup the Next.js edge cannot see httpOnly cookies, so requiring them here breaks
    // login (redirect loop). Only same-hostname setups (e.g. localhost) get strict middleware.
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

