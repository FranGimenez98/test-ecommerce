import { NextApiRequest, NextApiResponse } from "next";
import mercadopago from "mercadopago";
import Order from "@/models/Order";

mercadopago.configure({
  access_token: process.env.NEXT_ACCESS_TOKEN as string,
});

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return mercadoPagoPayment(req, res);
  }
}

async function mercadoPagoPayment(req: NextApiRequest, res: NextApiResponse) {
  const URL =
    "https://93c7-2800-810-4fd-8662-29bc-ffc9-a548-2e55.ngrok-free.app";

  const {
    // title,
    // description,
    // picture_url,
    // unit_price,
    // quantity,
    items,
    name,
    surname,
    email,
    area_code,
    phone_number,
    dni_number,
    zip_code,
    street_name,
    street_number,
    floor,
    apartment,
    city_name,
    state_name,
    userId,
    orderId,
  } = req.body;

  try {
    const preference: any = {
      items: items.map((item: any) => ({
        id: item._id,
        title: item.name,
        description: "Hola",
        picture_url: item.image,
        unit_price: item.price,
        quantity: item.quantity,
      })),
      payer: {
        name: name,
        surname: surname,
        email: email,
        phone: {
          // area_code: area_code,
          number: phone_number,
        },
        identification: {
          type: "DNI",
          number: dni_number,
        },
        address: {
          zip_code: zip_code,
          street_name: street_name,
          street_number: street_number,
          floor: floor,
          apartment: apartment,
          city_name: city_name,
          state_name: state_name,
          country_name: "Argentina",
        },
      },
      metadata: {
        order: orderId,
        items: items.map((item: any) => ({
          id: item._id,
          title: item.name,
          description: "Hola",
          picture_url: item.image,
          unit_price: item.price,
          quantity: item.quantity,
          size: item.size,
        })),
      },
      back_urls: {
        success: `${URL}/success`,
        pending: `${URL}`,
        failure: `${URL}`,
      },
      auto_return: "approved",
      notification_url: `${URL}/api/notify`,
    };

    const response = await mercadopago.preferences.create(preference);

    res.status(200).send({ url: response.body.init_point });
  } catch (error) {
    res.status(400).json({ message: "Method not allowed", error: error });
  }
}

export default handler;
