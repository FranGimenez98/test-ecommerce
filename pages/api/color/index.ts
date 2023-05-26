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
    const color = await Color.create(req.body);
    return res.status(200).json(color);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
