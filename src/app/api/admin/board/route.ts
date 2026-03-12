import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import BoardMember from "@/models/BoardMember";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const designation = String(body.designation ?? "").trim();
    const displayOrder = typeof body.order === "number" ? body.order : 0;

    if (!name) {
      return errorResponse("Name is required", 400, "VALIDATION_ERROR");
    }
    if (!designation) {
      return errorResponse("Designation is required", 400, "VALIDATION_ERROR");
    }

    const member = await BoardMember.create({
      name,
      designation,
      displayOrder: Math.max(0, displayOrder),
    });

    return successResponse(
      {
        id: String(member._id),
        name: member.name,
        designation: member.designation,
        order: member.displayOrder,
      },
      201,
      "Board member added"
    );
  } catch (err) {
    console.error("Create board member error:", err);
    return errorResponse("Failed to add board member", 500, "INTERNAL_ERROR");
  }
}
