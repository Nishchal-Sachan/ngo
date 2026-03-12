import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import BankDetails from "@/models/BankDetails";

export async function GET() {
  try {
    await connectDB();
    const bank = await BankDetails.findOne();

    if (!bank) {
      return successResponse(null);
    }

    return successResponse({
      bankName: bank.bankName,
      accountName: bank.accountName,
      accountNumber: bank.accountNumber,
      ifsc: bank.ifsc,
      branch: bank.branch,
      contactEmail: bank.contactEmail,
    });
  } catch (err) {
    console.error("Get bank error:", err);
    return errorResponse("Failed to fetch bank details", 500, "INTERNAL_ERROR");
  }
}
