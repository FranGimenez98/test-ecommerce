import { connect } from "@/lib/db";
import Favorite from "@/models/Favorite";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return addFavorite(req, res);
  }
  // if (req.method === "DELETE") {
  //   return deleteFavorite(req, res);
  // }
}

const addFavorite = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, productId } = req.body;
  try {
    await connect();
    const hasFavorite = await Favorite.findOne({ product: productId });
    if (hasFavorite) {
      return res.status(404).send({ message: "Favorite already exists" });
    }
    const favorite = new Favorite({ user: userId, product: productId });
    await favorite.save();

    res
      .status(200)
      .json({ message: "Producto guardado en favoritos correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ha ocurrido un error al guardar el producto en favoritos",
    });
  }
};

export default handler;
