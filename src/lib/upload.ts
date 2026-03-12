/**
 * Local file storage in uploads folder.
 * Works both locally and in production with persistent disk.
 */
import { writeFile, unlink } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export const UPLOAD_PATHS = {
  campaigns: "campaigns",
  reports: "reports",
  hero: "hero",
} as const;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

function getExtension(mimeType: string, fallback = ""): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "application/pdf": ".pdf",
  };
  return map[mimeType] ?? fallback;
}

/**
 * Ensures the uploads directory exists. Uses sync ops for reliability before async write.
 */
function ensureUploadsDir(): void {
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Save a file buffer to the uploads folder. Returns the public URL path.
 * Filename: Date.now()-randomUUID().ext to avoid collisions.
 */
export async function saveFile(
  subfolder: keyof typeof UPLOAD_PATHS,
  buffer: Buffer,
  mimeType: string,
  originalName?: string
): Promise<{ url: string; relativePath: string }> {
  ensureUploadsDir();
  const folder = UPLOAD_PATHS[subfolder];
  const dir = path.join(UPLOADS_DIR, folder);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const ext = getExtension(mimeType, path.extname(originalName ?? "") || ".bin");
  const filename = `${Date.now()}-${randomUUID()}${ext}`;
  const fullPath = path.join(dir, filename);
  await writeFile(fullPath, buffer);

  const url = `/uploads/${folder}/${filename}`;
  const relativePath = `${folder}/${filename}`;
  return { url, relativePath };
}

/**
 * Save hero image directly to /public/uploads (no subfolder).
 * Returns path like /uploads/filename.jpg for Next.js static serving.
 */
export async function saveHeroImage(
  buffer: Buffer,
  mimeType: string,
  originalName?: string
): Promise<{ url: string; relativePath: string }> {
  ensureUploadsDir();

  const ext = getExtension(mimeType, path.extname(originalName ?? "") || ".jpg");
  const filename = `${Date.now()}-${randomUUID()}${ext}`;
  const fullPath = path.join(UPLOADS_DIR, filename);
  await writeFile(fullPath, buffer);

  const url = `/uploads/${filename}`;
  const relativePath = filename;
  return { url, relativePath };
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
 * Delete a file by its stored path (e.g. reports/xxx.pdf or filename.jpg).
 */
export async function deleteFile(relativePath: string): Promise<void> {
  const fullPath = path.join(UPLOADS_DIR, relativePath);
  try {
    await unlink(fullPath);
  } catch (err) {
    console.warn("[Upload] Delete failed:", fullPath, err);
  }
}
