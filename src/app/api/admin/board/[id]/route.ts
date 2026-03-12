import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import BoardMember from "@/models/BoardMember";
import mongoose from "mongoose";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid member ID", 400, "VALIDATION_ERROR");
    }

    await connectDB();
    const body = await request.json();
    const update: Record<string, unknown> = {};
    if (body.name != null) update.name = String(body.name).trim();
    if (body.designation != null) update.designation = String(body.designation).trim();
    if (typeof body.order === "number") update.displayOrder = Math.max(0, body.order);

    if (Object.keys(update).length === 0) {
      return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
    }

    if (update.name === "") {
      return errorResponse("Name is required", 400, "VALIDATION_ERROR");
    }
    if (update.designation === "") {
      return errorResponse("Designation is required", 400, "VALIDATION_ERROR");
    }

    const member = await BoardMember.findByIdAndUpdate(
      id,
      update as { name?: string; designation?: string; displayOrder?: number },
      { new: true }
    );

    if (!member) {
      return errorResponse("Board member not found", 404, "NOT_FOUND");
    }

    return successResponse(
      {
        id: String(member._id),
        name: member.name,
        designation: member.designation,
        order: member.displayOrder,
      },
      200,
      "Board member updated"
    );
  } catch (err) {
    console.error("Update board member error:", err);
    return errorResponse("Failed to update board member", 500, "INTERNAL_ERROR");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid member ID", 400, "VALIDATION_ERROR");
    }

    await connectDB();
    const deleted = await BoardMember.findByIdAndDelete(id);

    if (!deleted) {
      return errorResponse("Board member not found", 404, "NOT_FOUND");
    }

    return successResponse({ deleted: true }, 200, "Board member deleted");
  } catch (err) {
    console.error("Delete board member error:", err);
    return errorResponse("Failed to delete board member", 500, "INTERNAL_ERROR");
  }
}
