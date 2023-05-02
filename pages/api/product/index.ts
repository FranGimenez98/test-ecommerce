import Product from "@/models/Product";
import db from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return postProduct(req, res);
  }
  if (req.method === "GET") {
    return getProducts(req, res);
  }
}

const postProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  try {
    const product = await Product.create(req.body);
    await db.disconnect();
    res.status(200).json(product);
  } catch (error) {
    return console.log("error", error);
  }
};

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  try {
    const products = await Product.find();
    await db.disconnect();
    res.status(200).json(products);
  } catch (error) {
    return console.log("error", error);
  }
};

export default handler;
