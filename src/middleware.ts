import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { getJwtSecret } from "@/lib/env";

const ADMIN_LOGIN_PATH = "/admin/login";

async function verifyAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;

  const secret = new TextEncoder().encode(getJwtSecret());

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLogin = pathname === ADMIN_LOGIN_PATH;
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminPage) {
    const isAuth = await verifyAuth(request);
    if (isAdminLogin) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    } else if (!isAuth) {
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAdminApi) {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
