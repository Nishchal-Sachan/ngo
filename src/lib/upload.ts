/**
 * Local file storage in uploads folder.
 * Replaces Cloudinary for images and reports.
 */
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export const UPLOAD_PATHS = {
  campaigns: "campaigns",
  reports: "reports",
  hero: "hero",
} as const;

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

async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

/**
 * Save a file buffer to the uploads folder. Returns the public URL path.
 */
export async function saveFile(
  subfolder: keyof typeof UPLOAD_PATHS,
  buffer: Buffer,
  mimeType: string,
  originalName?: string
): Promise<{ url: string; relativePath: string }> {
  const folder = UPLOAD_PATHS[subfolder];
  const dir = path.join(UPLOADS_DIR, folder);
  await ensureDir(dir);

  const ext = getExtension(mimeType, path.extname(originalName ?? "") || ".bin");
  const filename = `${randomUUID()}${ext}`;
  const fullPath = path.join(dir, filename);
  await writeFile(fullPath, buffer);

  const url = `/uploads/${folder}/${filename}`;
  const relativePath = `${folder}/${filename}`;
  return { url, relativePath };
}

/**
 * Delete a file by its stored path (e.g. reports/xxx.pdf).
 * Used when publicId stores the relative path.
 */
export async function deleteFile(relativePath: string): Promise<void> {
  const fullPath = path.join(UPLOADS_DIR, relativePath);
  try {
    await unlink(fullPath);
  } catch (err) {
    console.warn("[Upload] Delete failed:", fullPath, err);
  }
}
