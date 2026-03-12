import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import HeroSection from "@/models/HeroSection";

export async function GET() {
  try {
    await connectDB();
    const hero = await HeroSection.findOne();

    if (!hero) {
      return successResponse(null);
    }

    return successResponse({
      title: hero.title,
      subtitle: hero.subtitle,
      description: hero.description,
      imageUrl: hero.imageUrl,
      heroImage: hero.imageUrl,
      ctaPrimaryText: hero.ctaPrimaryText,
      ctaSecondaryText: hero.ctaSecondaryText,
    });
  } catch (err) {
    console.error("Get hero error:", err);
    return errorResponse("Failed to fetch hero content", 500, "INTERNAL_ERROR");
  }
}
