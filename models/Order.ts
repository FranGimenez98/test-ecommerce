import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        size: { type: String },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
    totalPrice: { type: Number },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED"],
      default: "PENDING",
      required: true,
    },
  },
  { timestamps: true }
);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
