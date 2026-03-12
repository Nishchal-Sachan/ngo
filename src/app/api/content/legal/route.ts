import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import LegalInfo from "@/models/LegalInfo";

export async function GET() {
  try {
    await connectDB();
    const legal = await LegalInfo.findOne();

    if (!legal) {
      return successResponse(null);
    }

    return successResponse({
      registrationNumber: legal.registrationNumber,
      registeredUnder: legal.registeredUnder,
      is80GCompliant: legal.is80GCompliant,
      is12ACompliant: legal.is12ACompliant,
      status: legal.status,
    });
  } catch (err) {
    console.error("Get legal error:", err);
    return errorResponse("Failed to fetch legal information", 500, "INTERNAL_ERROR");
  }
}
