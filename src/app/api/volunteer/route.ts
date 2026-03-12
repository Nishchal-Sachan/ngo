import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import Volunteer from "@/models/Volunteer";
import { sendVolunteerConfirmation } from "@/services/email";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const volunteer = await Volunteer.create({
      name: String(body.name ?? "").trim(),
      email: String(body.email ?? "").trim().toLowerCase(),
      phone: String(body.phone ?? "").replace(/\D/g, "").slice(-10),
    });

    sendVolunteerConfirmation(volunteer.email, volunteer.name).catch(() => {});

    return successResponse(
      {
        id: String(volunteer._id),
        name: volunteer.name,
        email: volunteer.email,
        createdAt: volunteer.createdAt,
      },
      201,
      "Thank you for registering as a volunteer!"
    );
  } catch (err) {
    console.error("Volunteer registration error:", err);
    return errorResponse("Failed to register volunteer", 500, "INTERNAL_ERROR");
  }
}
