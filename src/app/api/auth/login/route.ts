import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";
import { signToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse("Email and password are required", 400, "VALIDATION_ERROR");
    }

    const admin = await AdminUser.findOne({ email: email.trim().toLowerCase() });

    if (!admin) {
      return errorResponse("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return errorResponse("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const token = signToken({
      userId: String(admin._id),
      email: admin.email,
    });

    const response = successResponse(
      {
        user: {
          id: String(admin._id),
          email: admin.email,
          name: admin.name,
        },
      },
      200,
      "Login successful"
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return errorResponse("Login failed", 500, "INTERNAL_ERROR");
  }
}
