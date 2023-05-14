import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentId: {type: String, required: true},
    status: {type: String, required: true},
  },
  { timestamps: true }
);
const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
