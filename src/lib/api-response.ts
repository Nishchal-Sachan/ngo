import { NextResponse } from "next/server";

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export function successResponse<T>(
  data: T,
  status = 200,
  message?: string
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    { success: true, data, ...(message && { message }) },
    { status }
  );
}

export function errorResponse(
  error: string,
  status = 400,
  code?: string
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error, ...(code && { code }) },
    { status }
  );
}
