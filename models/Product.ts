import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sizes: [
      {
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    image: { type: String, required: true },
    description: { type: String, required: true },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    sex: { type: String, enum: ["Men", "Women"], required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
