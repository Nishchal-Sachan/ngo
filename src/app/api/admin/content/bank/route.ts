import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import BankDetails from "@/models/BankDetails";

const DEFAULT_BANK = {
  bankName: "",
  accountName: "",
  accountNumber: "",
  ifsc: "",
  branch: "",
  contactEmail: "",
};

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const update: Record<string, string> = {};
    if (body.bankName != null) update.bankName = String(body.bankName).trim();
    if (body.accountName != null) update.accountName = String(body.accountName).trim();
    if (body.accountNumber != null) update.accountNumber = String(body.accountNumber).trim();
    if (body.ifsc != null) update.ifsc = String(body.ifsc).trim();
    if (body.branch != null) update.branch = String(body.branch).trim();
    if (body.contactEmail != null) update.contactEmail = String(body.contactEmail).trim();

    if (Object.keys(update).length === 0) {
      return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
    }

    const fullUpdate = { ...DEFAULT_BANK, ...update };

    await connectDB();
    const existing = await BankDetails.findOne();
    let bank;
    if (existing) {
      Object.assign(existing, update);
      bank = await existing.save();
    } else {
      bank = await BankDetails.create(fullUpdate);
    }

    return successResponse(
      {
        bankName: bank.bankName,
        accountName: bank.accountName,
        accountNumber: bank.accountNumber,
        ifsc: bank.ifsc,
        branch: bank.branch,
        contactEmail: bank.contactEmail,
      },
      200,
      "Bank details updated"
    );
  } catch (err) {
    console.error("Update bank error:", err);
    return errorResponse("Failed to update bank details", 500, "INTERNAL_ERROR");
  }
}
