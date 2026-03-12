import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { saveFile } from "@/lib/upload";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return errorResponse("No file provided", 400, "VALIDATION_ERROR");
    }

    if (file.size > MAX_SIZE) {
      return errorResponse("File size must be under 5MB", 400, "VALIDATION_ERROR");
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse(
        "Invalid file type. Use JPEG, PNG, WebP, or GIF",
        400,
        "VALIDATION_ERROR"
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const { url, relativePath } = await saveFile(
      "campaigns",
      buffer,
      file.type,
      file.name
    );

    return successResponse({
      url,
      publicId: relativePath,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return errorResponse("Upload failed", 500, "INTERNAL_ERROR");
  }
}
