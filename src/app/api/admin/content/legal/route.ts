import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import LegalInfo from "@/models/LegalInfo";

const DEFAULT_LEGAL = {
  registrationNumber: "REG/2015/XXXX",
  registeredUnder: "Societies Registration Act, 1860",
  is80GCompliant: true,
  is12ACompliant: true,
  status: "Registered NGO",
};

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const update: Record<string, unknown> = {};
    if (body.registrationNumber != null) update.registrationNumber = String(body.registrationNumber).trim();
    if (body.registeredUnder != null) update.registeredUnder = String(body.registeredUnder).trim();
    if (body.is80GCompliant != null) update.is80GCompliant = Boolean(body.is80GCompliant);
    if (body.is12ACompliant != null) update.is12ACompliant = Boolean(body.is12ACompliant);
    if (body.status != null) update.status = String(body.status).trim();

    if (Object.keys(update).length === 0) {
      return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
    }

    const fullUpdate = { ...DEFAULT_LEGAL, ...update };

    await connectDB();
    const existing = await LegalInfo.findOne();
    let legal;
    if (existing) {
      if (update.registrationNumber != null) existing.registrationNumber = update.registrationNumber as string;
      if (update.registeredUnder != null) existing.registeredUnder = update.registeredUnder as string;
      if (update.is80GCompliant != null) existing.is80GCompliant = update.is80GCompliant as boolean;
      if (update.is12ACompliant != null) existing.is12ACompliant = update.is12ACompliant as boolean;
      if (update.status != null) existing.status = update.status as string;
      legal = await existing.save();
    } else {
      legal = await LegalInfo.create(fullUpdate);
    }

    return successResponse(
      {
        registrationNumber: legal.registrationNumber,
        registeredUnder: legal.registeredUnder,
        is80GCompliant: legal.is80GCompliant,
        is12ACompliant: legal.is12ACompliant,
        status: legal.status,
      },
      200,
      "Legal information updated"
    );
  } catch (err) {
    console.error("Update legal error:", err);
    return errorResponse("Failed to update legal information", 500, "INTERNAL_ERROR");
  }
}
