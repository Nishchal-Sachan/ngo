import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import AboutContent from "@/models/AboutContent";

export async function GET() {
  try {
    await connectDB();
    const about = await AboutContent.findOne();

    if (!about) {
      return successResponse(null);
    }

    const objectives = Array.isArray(about.objectives) ? about.objectives : [];
    return successResponse({
      aboutText: about.aboutText,
      visionText: about.visionText,
      missionText: about.missionText,
      objectives,
    });
  } catch (err) {
    console.error("Get about error:", err);
    return errorResponse("Failed to fetch about content", 500, "INTERNAL_ERROR");
  }
}
