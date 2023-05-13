import { NextApiRequest, NextApiResponse } from "next";
import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.NEXT_ACCESS_TOKEN as string,
});

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return mercadoPagoPayment(req, res);
  }
}

async function mercadoPagoPayment(req: NextApiRequest, res: NextApiResponse) {
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
    // country_name,
  } = req.body;

  try {
    const preference: any = {
      // items: [
      //   {
      //     title: title,
      //     description: description,
      //     picture_url: picture_url,
      //     unit_price: unit_price,
      //     quantity: quantity,
      //     currency_id: "ARS",
      //   },
      // ],
      items,
      payer: {
        name: name,
        surname: surname,
        email: email,
        phone: {
          area_code: area_code,
           number: phone_number
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
      back_urls: {
        success: "https://mi-sitio.com/pago-exitoso",
        pending: "https://mi-sitio.com/pago-pendiente",
        failure: "https://mi-sitio.com/pago-fallido",
      },
      auto_return: "approved",
      notification_url: "https://mi-sitio.com/pago-notificado",
    };

    const response = await mercadopago.preferences.create(preference);
    res.status(200).send({ url: response.body.init_point });
  } catch (error) {
    res.status(400).json({ message: "Method not allowed", error: error });
  }
}

export default handler;
