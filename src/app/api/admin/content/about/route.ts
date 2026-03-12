import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import AboutContent from "@/models/AboutContent";

const DEFAULT_ABOUT = {
  aboutText:
    "Kanhaiya Lal Shakya Social Welfare Society was established in 2015 as a registered non-profit organization under the Societies Registration Act, 1860. The organization operates with the objective of addressing socio-economic challenges in underprivileged communities through structured programs in education, healthcare, environmental conservation, and women empowerment. All activities are conducted in accordance with applicable statutory requirements and governance standards.",
  visionText:
    "To build an equitable society where every individual has access to education, healthcare, and opportunities for sustainable livelihood.",
  missionText:
    "To implement evidence-based programs that empower underprivileged communities through education, healthcare delivery, environmental initiatives, and capacity-building, while maintaining transparency and accountability in all operations.",
  objectives: [
    "Provide access to quality education for underprivileged children and youth.",
    "Conduct healthcare outreach programs in rural and underserved areas.",
    "Implement environmental conservation and afforestation initiatives.",
    "Support women empowerment through skill development and livelihood programs.",
    "Ensure transparent governance and compliance with regulatory requirements.",
  ],
};

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const update: Record<string, unknown> = {};
    if (body.aboutText != null) update.aboutText = String(body.aboutText).trim();
    if (body.visionText != null) update.visionText = String(body.visionText).trim();
    if (body.missionText != null) update.missionText = String(body.missionText).trim();
    if (body.objectives != null) {
      update.objectives = Array.isArray(body.objectives)
        ? body.objectives.filter((o: unknown) => typeof o === "string").map((o: string) => o.trim())
        : [];
    }

    if (Object.keys(update).length === 0) {
      return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
    }

    const fullUpdate = { ...DEFAULT_ABOUT, ...update };

    await connectDB();
    const existing = await AboutContent.findOne();
    let about;
    if (existing) {
      existing.aboutText = (fullUpdate.aboutText as string) ?? existing.aboutText;
      existing.visionText = (fullUpdate.visionText as string) ?? existing.visionText;
      existing.missionText = (fullUpdate.missionText as string) ?? existing.missionText;
      existing.objectives = (fullUpdate.objectives as string[]) ?? existing.objectives;
      about = await existing.save();
    } else {
      about = await AboutContent.create({
        aboutText: fullUpdate.aboutText as string,
        visionText: fullUpdate.visionText as string,
        missionText: fullUpdate.missionText as string,
        objectives: fullUpdate.objectives as string[],
      });
    }

    const objectives = Array.isArray(about.objectives) ? about.objectives : [];
    return successResponse(
      {
        aboutText: about.aboutText,
        visionText: about.visionText,
        missionText: about.missionText,
        objectives,
      },
      200,
      "About content updated"
    );
  } catch (err) {
    console.error("Update about error:", err);
    return errorResponse("Failed to update about content", 500, "INTERNAL_ERROR");
  }
}
