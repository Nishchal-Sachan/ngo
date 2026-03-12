import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import Campaign from "@/models/Campaign";
import { createCampaignSchema } from "@/lib/validations/campaign";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createCampaignSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return errorResponse(
        first?.message ?? "Validation failed",
        400,
        "VALIDATION_ERROR"
      );
    }

    const campaign = await Campaign.create({
      title: parsed.data.title,
      description: parsed.data.description,
      goalAmount: parsed.data.goalAmount,
      raisedAmount: parsed.data.raisedAmount ?? 0,
      isActive: parsed.data.status === "active",
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate as string | Date) : undefined,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate as string | Date) : undefined,
      imageUrl: parsed.data.imageUrl?.trim() || undefined,
    });

    return successResponse(
      {
        id: String(campaign._id),
        title: campaign.title,
        status: campaign.isActive ? "active" : "draft",
        createdAt: campaign.createdAt,
      },
      201,
      "Campaign created successfully"
    );
  } catch (err) {
    console.error("Campaign creation error:", err);
    return errorResponse("Failed to create campaign", 500, "INTERNAL_ERROR");
  }
}
