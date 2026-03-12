import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import Campaign from "@/models/Campaign";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "draft" | "active" | "completed" | "cancelled" | null;

    const filter =
      status === "active"
        ? { isActive: true }
        : status === "draft" || status === "completed" || status === "cancelled"
          ? { isActive: false }
          : {};
    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 });

    const data = campaigns.map((c) => ({
      id: String(c._id),
      title: c.title,
      description: c.description,
      goalAmount: c.goalAmount,
      raisedAmount: c.raisedAmount,
      status: c.isActive ? "active" : "draft",
      startDate: c.startDate,
      endDate: c.endDate,
      imageUrl: c.imageUrl,
      createdAt: c.createdAt,
    }));

    return successResponse(data);
  } catch (err) {
    console.error("Get campaigns error:", err);
    return errorResponse("Failed to fetch campaigns", 500, "INTERNAL_ERROR");
  }
}
