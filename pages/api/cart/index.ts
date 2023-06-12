import { connect } from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return addToCart(req, res);
  }
}
const addToCart = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, productId, quantity, sizeName } = req.body;

  try {
    await connect();
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const size = product.sizes.find(
      (s: any) => s.size === sizeName && s.quantity >= quantity
    );

    if (!size) {
      throw new Error("No hay suficiente stock del producto");
    }

    let itemIndex = cart.items.findIndex(
      (i: any) => i.product._id === productId
    );

    if (itemIndex >= 0) {
      // Si el producto ya está en el carrito, actualizar la cantidad y el precio
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price += quantity * product.price;
    } else {
      // Si el producto no está en el carrito, agregarlo con la cantidad correspondiente
      cart.items.push({
        product: productId,
        quantity,
        price: quantity * product.price,
      });
      itemIndex = cart.items.length - 1; // update itemIndex to the new index
      // Actualizar el stock del producto
      size.quantity -= quantity;
      product.stock -= quantity;
    }

    // Calcular el precio total del carrito
    cart.totalPrice = cart.items.reduce(
      (acc: number, item: any) => acc + item.price,
      0
    );

    // Guardar los cambios
    await Promise.all([product.save(), cart.save()]);

    return res.status(200).json(cart.toObject());
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al procesar la solicitud" });
  }
};
