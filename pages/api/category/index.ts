import Category from "@/models/Category";
import { connect } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return createCategory(req, res);
  }
}

const createCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connect();
    const category = await Category.create(req.body);
    return res.status(200).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
