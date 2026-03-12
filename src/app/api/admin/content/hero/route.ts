import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import HeroSection from "@/models/HeroSection";
import { saveFile } from "@/lib/upload";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function PUT(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    let data: {
      title?: string;
      subtitle?: string;
      description?: string;
      imageUrl?: string;
      ctaPrimaryText?: string;
      ctaSecondaryText?: string;
    };

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const image = formData.get("image") as File | null;

      let imageUrl: string | undefined;

      if (image && image.size > 0) {
        if (image.size > MAX_IMAGE_SIZE) {
          return errorResponse("Image must be under 5MB", 400, "VALIDATION_ERROR");
        }
        if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
          return errorResponse(
            "Invalid image type. Use JPEG, PNG, WebP, or GIF",
            400,
            "VALIDATION_ERROR"
          );
        }

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const { url } = await saveFile("hero", buffer, image.type, image.name);
        imageUrl = url;
      }

      const existingUrl = formData.get("imageUrl") as string | null;
      data = {
        title: (formData.get("title") as string) || undefined,
        subtitle: (formData.get("subtitle") as string) || undefined,
        description: (formData.get("description") as string) || undefined,
        imageUrl: imageUrl ?? (existingUrl?.trim() || undefined),
        ctaPrimaryText: (formData.get("ctaPrimaryText") as string) || undefined,
        ctaSecondaryText: (formData.get("ctaSecondaryText") as string) || undefined,
      };
    } else {
      const body = await request.json();
      data = {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        imageUrl: body.imageUrl?.trim() || undefined,
        ctaPrimaryText: body.ctaPrimaryText,
        ctaSecondaryText: body.ctaSecondaryText,
      };
    }

    const update: Record<string, string> = {};
    if (data.title != null) update.title = data.title;
    if (data.subtitle != null) update.subtitle = data.subtitle;
    if (data.description != null) update.description = data.description;
    if (data.imageUrl != null) update.imageUrl = data.imageUrl;
    if (data.ctaPrimaryText != null) update.ctaPrimaryText = data.ctaPrimaryText;
    if (data.ctaSecondaryText != null) update.ctaSecondaryText = data.ctaSecondaryText;

    if (Object.keys(update).length === 0) {
      return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
    }

    const defaults = {
      title: "Kanhaiya Lal Shakya Social Welfare Society",
      subtitle: "Empowering Communities Through Sustainable Development Since 2015.",
      description:
        "We are a registered non-profit dedicated to uplifting underprivileged communities through education, healthcare, environmental initiatives, and women empowerment.",
      imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80",
      ctaPrimaryText: "Donate",
      ctaSecondaryText: "Volunteer",
    };

    await connectDB();
    const existing = await HeroSection.findOne();
    let hero;
    if (existing) {
      Object.assign(existing, update);
      existing.updatedAt = new Date();
      hero = await existing.save();
    } else {
      hero = await HeroSection.create({ ...defaults, ...update });
    }

    return successResponse(
      {
        title: hero.title,
        subtitle: hero.subtitle,
        description: hero.description,
        imageUrl: hero.imageUrl,
        ctaPrimaryText: hero.ctaPrimaryText,
        ctaSecondaryText: hero.ctaSecondaryText,
      },
      200,
      "Hero section updated"
    );
  } catch (err) {
    console.error("Update hero error:", err);
    return errorResponse("Failed to update hero", 500, "INTERNAL_ERROR");
  }
}
