import { connect } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import mercadopago from "mercadopago";
import { NextApiRequest, NextApiResponse } from "next";

mercadopago.configure({
  access_token: process.env.NEXT_ACCESS_TOKEN as string,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;

  const topic = query.topic || query.type;

  try {
    if (topic === "payment") {
      const paymentId = query.id || query["data.id"];
      let payment = await mercadopago.payment.findById(Number(paymentId));
      let paymentStatus = payment.body.status;
      let orderId = payment.body.metadata.order;
      let items = payment.body.metadata.items;
      console.log(payment.body);
      console.log(payment.body.metadata);

      if (paymentStatus === "approved") {
        try {
          await connect();

          for (const item of items) {
            const productId = item.id;
            const selectedSize = item.size;
            const quantity = item.quantity;

            await Product.updateOne(
              { _id: productId },
              { $inc: { "sizes.$[elem].quantity": -quantity } },
              { arrayFilters: [{ "elem.size": selectedSize }] }
            );

            await Product.updateOne(
              { _id: productId },
              { $inc: { stock: -quantity } }
            );
          }

          const order = await Order.findByIdAndUpdate(
            orderId,
            { status: "APPROVED" },
            { new: true }
          );
          res.status(200).send(order);
        } catch (error) {
          res
            .status(400)
            .send({ message: "Error cannot upadate order", error: error });
        }
      }
    }
  } catch (error) {
    res.status(400).send({ message: "<Internal server error", error: error });
  }
}

export default handler;
