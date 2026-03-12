import { NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { isProd } from "@/lib/env";

export async function POST() {
  const response = successResponse({}, 200, "Logged out successfully");
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
