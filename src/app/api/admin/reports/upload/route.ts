import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { saveFile } from "@/lib/upload";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB for PDFs
const ALLOWED_TYPES = ["application/pdf"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return errorResponse("No file provided", 400, "VALIDATION_ERROR");
    }

    if (file.size > MAX_SIZE) {
      return errorResponse("File size must be under 20MB", 400, "VALIDATION_ERROR");
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse("Invalid file type. Only PDF is allowed", 400, "VALIDATION_ERROR");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const { url, relativePath } = await saveFile(
      "reports",
      buffer,
      file.type,
      file.name
    );

    return successResponse({
      url,
      publicId: relativePath,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err) {
    console.error("Report upload error:", err);
    return errorResponse("Upload failed", 500, "INTERNAL_ERROR");
  }
}
