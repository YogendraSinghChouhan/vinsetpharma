import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { ROUTES } from "@/config/site";

// This proxy only handles optimistic redirects for admin authentication
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const sessionCookie = getSessionCookie(request);
  const isLoginPage = pathname === ROUTES.adminLogin;

  if (!sessionCookie && !isLoginPage) {
    const loginUrl = new URL(ROUTES.adminLogin, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionCookie && isLoginPage) {
    const adminUrl = new URL(ROUTES.admin, request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
