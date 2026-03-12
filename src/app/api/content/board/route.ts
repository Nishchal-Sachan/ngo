import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import BoardMember from "@/models/BoardMember";

export async function GET() {
  try {
    await connectDB();
    const members = await BoardMember.find().sort({ displayOrder: 1 });

    const data = members.map((m) => ({
      id: String(m._id),
      name: m.name,
      designation: m.designation,
      order: m.displayOrder,
    }));

    return successResponse(data);
  } catch (err) {
    console.error("Get board error:", err);
    return errorResponse("Failed to fetch board members", 500, "INTERNAL_ERROR");
  }
}
