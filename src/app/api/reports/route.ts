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
