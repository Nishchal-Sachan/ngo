import mongoose from "mongoose";

const heroSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    ctaPrimaryText: { type: String, default: "Donate" },
    ctaSecondaryText: { type: String, default: "Volunteer" },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.models.HeroSection || mongoose.model("HeroSection", heroSectionSchema);
