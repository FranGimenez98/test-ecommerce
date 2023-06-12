import Product from "@/models/Product";
import { connect } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    return editProduct(req, res);
  }
  if (req.method === "DELETE") {
    return deleteProducts(req, res);
  }
}

const editProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { body } = req.body;
  try {
    await connect();
    const updateProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updateProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(updateProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  try {
    await connect();
    const delteProduct = await Product.findByIdAndDelete(id);
    if (!delteProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(delteProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
