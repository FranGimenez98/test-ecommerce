import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true }
);
const Color = mongoose.models.Color || mongoose.model("Color", colorSchema);
export default Color;
