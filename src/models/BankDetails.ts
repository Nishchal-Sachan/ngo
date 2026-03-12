import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema(
  {
    bankName: { type: String, default: "" },
    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    ifsc: { type: String, default: "" },
    branch: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
  },
  { timestamps: false }
);

export default mongoose.models.BankDetails || mongoose.model("BankDetails", bankDetailsSchema);
