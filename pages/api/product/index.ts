import Product from "@/models/Product";
import { connect } from "@/lib/db";
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
  await connect();

  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    return console.log("error", error);
  }
};

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();

  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    return console.log("error", error);
  }
};

export default handler;
