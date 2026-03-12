import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import Donation from "@/models/Donation";

export async function GET() {
  try {
    await connectDB();
    const donations = await Donation.find().sort({ createdAt: -1 }).limit(100);

    const data = donations.map((d) => ({
      id: String(d._id),
      name: d.donorName,
      amount: d.amount,
      receiptNumber: d.receiptNumber ?? "",
      verified: true,
      createdAt: d.createdAt,
    }));

    return successResponse(data);
  } catch (err) {
    console.error("Get donations error:", err);
    return errorResponse("Failed to fetch donations", 500, "INTERNAL_ERROR");
  }
}
