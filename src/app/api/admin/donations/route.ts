import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import Donation from "@/models/Donation";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") ?? "10", 10)));
    const search = searchParams.get("search")?.trim();
    const skip = (page - 1) * limit;

    const filter = search
      ? { donorName: { $regex: search, $options: "i" } }
      : {};

    const [donations, total] = await Promise.all([
      Donation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Donation.countDocuments(filter),
    ]);

    const data = donations.map((d) => ({
      id: String(d._id),
      name: d.donorName,
      email: d.email,
      amount: d.amount,
      receiptNumber: d.receiptNumber ?? "",
      razorpayPaymentId: d.paymentId ?? "",
      verified: true,
      createdAt: d.createdAt,
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
    console.error("Get donations error:", err);
    return errorResponse("Failed to fetch donations", 500, "INTERNAL_ERROR");
  }
}
