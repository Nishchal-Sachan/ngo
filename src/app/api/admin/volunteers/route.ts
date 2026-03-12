import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import Volunteer from "@/models/Volunteer";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") ?? "10", 10)));
    const skip = (page - 1) * limit;

    const filter = search
      ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : {};

    const [volunteers, total] = await Promise.all([
      Volunteer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Volunteer.countDocuments(filter),
    ]);

    const data = volunteers.map((v) => ({
      id: String(v._id),
      name: v.name,
      email: v.email,
      phone: v.phone,
      createdAt: v.createdAt,
    }));

    return successResponse({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get volunteers error:", err);
    return errorResponse("Failed to fetch volunteers", 500, "INTERNAL_ERROR");
  }
}
