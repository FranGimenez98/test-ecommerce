import { connect } from "@/lib/db";
import Favorite from "@/models/Favorite";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    return deleteFavorite(req, res);
  }
}

const deleteFavorite = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, productId } = req.query;
  try {
    await connect();
    const favorito = await Favorite.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!favorito) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    res.status(200).json({ message: "Favorito eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ha ocurrido un error al eliminar el favorito" });
  }
};

export default handler;
