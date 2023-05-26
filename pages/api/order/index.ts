import { connect } from "@/lib/db";
import Order from "@/models/Order";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST"){
        return createOrder(req, res)
    }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse) =>{
    try {
        await connect();
        const order = await Order.create(req.body);
        return res.status(200).json(order)
    } catch (error) {

    }
}

export default handler

