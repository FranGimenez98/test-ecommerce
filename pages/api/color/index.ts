import Color from "@/models/Color";
import { connect } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return createColor(req, res);
  }
}

const createColor = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connect();
    
    const { name, color } = req.body;

    const existingColor = await Color.findOne({ $or: [{ name }, { color }] });
    if (existingColor) {
      return res.status(400).json({ error: "El color ya existe" });
    }

    const createdColor = await Color.create(req.body);
    return res.status(200).json(createdColor);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};


export default handler;
