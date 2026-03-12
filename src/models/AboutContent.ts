import mongoose from "mongoose";

const aboutContentSchema = new mongoose.Schema(
  {
    aboutText: { type: String, default: "" },
    visionText: { type: String, default: "" },
    missionText: { type: String, default: "" },
    objectives: { type: [String], default: [] },
  },
  { timestamps: false }
);

export default mongoose.models.AboutContent || mongoose.model("AboutContent", aboutContentSchema);
