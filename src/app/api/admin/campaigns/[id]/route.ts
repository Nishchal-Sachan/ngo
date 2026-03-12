import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import Campaign from "@/models/Campaign";
import { updateCampaignSchema } from "@/lib/validations/campaign";
import mongoose from "mongoose";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid campaign ID", 400, "VALIDATION_ERROR");
    }

    await connectDB();
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return errorResponse("Campaign not found", 404, "NOT_FOUND");
    }

    return successResponse({
      id: String(campaign._id),
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      raisedAmount: campaign.raisedAmount,
      status: campaign.isActive ? "active" : "draft",
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      imageUrl: campaign.imageUrl,
      createdAt: campaign.createdAt,
    });
  } catch (err) {
    console.error("Get campaign error:", err);
    return errorResponse("Failed to fetch campaign", 500, "INTERNAL_ERROR");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid campaign ID", 400, "VALIDATION_ERROR");
    }

    const body = await request.json();
    const parsed = updateCampaignSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return errorResponse(
        first?.message ?? "Validation failed",
        400,
        "VALIDATION_ERROR"
      );
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) data.title = parsed.data.title;
    if (parsed.data.description !== undefined) data.description = parsed.data.description;
    if (parsed.data.goalAmount !== undefined) data.goalAmount = parsed.data.goalAmount;
    if (parsed.data.raisedAmount !== undefined) data.raisedAmount = parsed.data.raisedAmount;
    if (parsed.data.status !== undefined) data.isActive = parsed.data.status === "active";
    if (parsed.data.startDate !== undefined)
      data.startDate = parsed.data.startDate ? new Date(parsed.data.startDate as string | Date) : null;
    if (parsed.data.endDate !== undefined)
      data.endDate = parsed.data.endDate ? new Date(parsed.data.endDate as string | Date) : null;
    if (parsed.data.imageUrl !== undefined)
      data.imageUrl = parsed.data.imageUrl === "" ? null : parsed.data.imageUrl;

    await connectDB();
    const campaign = await Campaign.findByIdAndUpdate(id, data, { new: true });

    if (!campaign) {
      return errorResponse("Campaign not found", 404, "NOT_FOUND");
    }

    return successResponse({
      id: String(campaign._id),
      title: campaign.title,
      status: campaign.isActive ? "active" : "draft",
      createdAt: campaign.createdAt,
    });
  } catch (err) {
    console.error("Update campaign error:", err);
    return errorResponse("Failed to update campaign", 500, "INTERNAL_ERROR");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid campaign ID", 400, "VALIDATION_ERROR");
    }

    await connectDB();
    const deleted = await Campaign.findByIdAndDelete(id);

    if (!deleted) {
      return errorResponse("Campaign not found", 404, "NOT_FOUND");
    }

    return successResponse({ deleted: true }, 200, "Campaign deleted");
  } catch (err) {
    console.error("Delete campaign error:", err);
    return errorResponse("Failed to delete campaign", 500, "INTERNAL_ERROR");
  }
}
