import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true },
    email: { type: String },
    amount: { type: Number, required: true },
    paymentId: { type: String },
    receiptNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

donationSchema.index({ paymentId: 1 }, { unique: true, sparse: true });

export default mongoose.models.Donation || mongoose.model("Donation", donationSchema);
