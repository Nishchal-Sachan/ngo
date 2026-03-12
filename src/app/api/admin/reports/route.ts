import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import Report from "@/models/Report";

export async function GET() {
  try {
    await connectDB();
    const reports = await Report.find().sort({ year: -1, createdAt: -1 });

    const data = reports.map((r) => ({
      id: String(r._id),
      title: r.title,
      year: r.year,
      fileUrl: r.fileUrl,
      fileName: r.fileName,
      fileSize: r.fileSize,
      createdAt: r.createdAt,
    }));

    return successResponse(data);
  } catch (err) {
    console.error("Get reports error:", err);
    return errorResponse("Failed to fetch reports", 500, "INTERNAL_ERROR");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, year, fileUrl, fileName, fileSize, publicId } = body;

    if (!title || typeof title !== "string" || title.trim().length < 1) {
      return errorResponse("Title is required", 400, "VALIDATION_ERROR");
    }
    const yearNum = parseInt(String(year), 10);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      return errorResponse("Valid year (2000-2100) is required", 400, "VALIDATION_ERROR");
    }
    if (!fileUrl || !fileName || !publicId) {
      return errorResponse("File data is required", 400, "VALIDATION_ERROR");
    }

    const report = await Report.create({
      title: title.trim(),
      year: yearNum,
      fileUrl,
      fileName,
      fileSize: Number(fileSize) || 0,
      publicId,
    });

    return successResponse(
      {
        id: String(report._id),
        title: report.title,
        year: report.year,
        createdAt: report.createdAt,
      },
      201,
      "Report uploaded successfully"
    );
  } catch (err) {
    console.error("Create report error:", err);
    return errorResponse("Failed to create report", 500, "INTERNAL_ERROR");
  }
}
