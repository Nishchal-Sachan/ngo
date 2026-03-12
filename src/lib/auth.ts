import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getJwtSecret, isProd } from "@/lib/env";

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<TokenPayload, "iat" | "exp">): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = "auth-token";
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export function getAuthFromRequest(request: NextRequest): TokenPayload | null {
  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ??
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;
  return verifyToken(token);
}
