/**
 * Cloudinary upload - works in production (Vercel) and locally.
 * No local filesystem or multer disk storage.
 */
import { getCloudinary } from "./cloudinary";

const CLOUDINARY_FOLDER = "ngo-uploads";
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export type UploadFolder = "hero" | "campaigns" | "reports";

/**
 * Upload a buffer to Cloudinary. Returns secure_url and public_id.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: UploadFolder,
  options?: { mimeType?: string; resourceType?: "image" | "raw" | "auto" }
): Promise<{ url: string; publicId: string }> {
  const cloudFolder = `${CLOUDINARY_FOLDER}/${folder}`;
  const resourceType = options?.resourceType ?? "auto";
  const mimeType = options?.mimeType ?? "image/jpeg";

  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const cloudinary = getCloudinary();

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: cloudFolder,
    resource_type: resourceType,
  });

  if (!result?.secure_url || !result?.public_id) {
    throw new Error("Cloudinary upload failed: no URL returned");
  }

  return { url: result.secure_url, publicId: result.public_id };
}

/**
 * Upload hero image to Cloudinary. Returns Cloudinary URL.
 */
export async function saveHeroImage(
  buffer: Buffer,
  mimeType: string,
  _originalName?: string
): Promise<{ url: string; relativePath: string }> {
  const { url, publicId } = await uploadToCloudinary(buffer, "hero", {
    resourceType: "image",
    mimeType,
  });
  return { url, relativePath: publicId };
}

/**
 * Save file (campaigns/reports) to Cloudinary.
 */
export async function saveFile(
  subfolder: "campaigns" | "reports",
  buffer: Buffer,
  mimeType: string,
  _originalName?: string
): Promise<{ url: string; relativePath: string }> {
  const resourceType = mimeType === "application/pdf" ? "raw" : "image";
  const { url, publicId } = await uploadToCloudinary(buffer, subfolder, {
    resourceType,
    mimeType,
  });
  return { url, relativePath: publicId };
}

/**
 * Validate image file for hero upload. Throws on invalid.
 */
export function validateHeroImage(file: File): void {
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be under 5MB");
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new Error("Invalid image type. Use JPEG, PNG, or WebP only");
  }
}

/**
 * Delete a file from Cloudinary by public_id.
 */
export async function deleteFile(publicId: string): Promise<void> {
  try {
    const cloudinary = getCloudinary();
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
    if (result.result !== "ok" && result.result !== "not found") {
      console.warn("[Cloudinary] Delete result:", result);
    }
  } catch (err) {
    console.warn("[Cloudinary] Delete failed:", publicId, err);
  }
}
