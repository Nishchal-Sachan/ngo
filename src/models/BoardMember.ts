import mongoose from "mongoose";

const boardMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: false }
);

export default mongoose.models.BoardMember || mongoose.model("BoardMember", boardMemberSchema);
