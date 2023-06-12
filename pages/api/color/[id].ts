import Color from "@/models/Color";
import { connect } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    return editColor(req, res);
  }
  const { id } = req.query;

  if (req.method === "DELETE") {
    return deleteColor(req, res, id as string);
  }


}

const editColor = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { body } = req.body;
  try {
    await connect();

    const updateColor = await Color.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updateColor) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    return res.status(200).json(updateColor);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteColor = async (req: NextApiRequest, res: NextApiResponse, id: string) => {
  // const { id } = req.query;
  try {
    await connect();

    const deleteColor = await Color.findByIdAndDelete(id);

    if (!deleteColor) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(deleteColor);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
