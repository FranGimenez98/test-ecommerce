import Category from "@/models/Category";
import { connect } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    return editCategory(req, res);
  }
  if (req.method === "DELETE") {
    return deleteCategory(req, res);
  }
}

const editCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { body } = req.body;
  try {
    await connect();

    const updateCategory = await Category.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updateCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(updateCategory);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  try {
    await connect();

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(deletedCategory);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
