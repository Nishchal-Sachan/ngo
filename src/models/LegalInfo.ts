import mongoose from "mongoose";

const legalInfoSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, default: "" },
    registeredUnder: { type: String, default: "" },
    status: { type: String, default: "Registered NGO" },
    is80GCompliant: { type: Boolean, default: false },
    is12ACompliant: { type: Boolean, default: false },
  },
  { timestamps: false }
);

export default mongoose.models.LegalInfo || mongoose.model("LegalInfo", legalInfoSchema);
