import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
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

