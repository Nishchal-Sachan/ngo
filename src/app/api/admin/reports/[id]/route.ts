import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import Report from "@/models/Report";
import { deleteFile } from "@/lib/upload";
import mongoose from "mongoose";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid report ID", 400, "VALIDATION_ERROR");
    }

    await connectDB();
    const report = await Report.findById(id);

    if (!report) {
      return errorResponse("Report not found", 404, "NOT_FOUND");
    }

    try {
      await deleteFile(report.publicId);
    } catch (err) {
      console.warn("[Reports] File delete failed, removing DB record anyway:", err);
    }

    await Report.findByIdAndDelete(id);

    return successResponse({ deleted: true }, 200, "Report deleted");
  } catch (err) {
    console.error("Delete report error:", err);
    return errorResponse("Failed to delete report", 500, "INTERNAL_ERROR");
  }
}
