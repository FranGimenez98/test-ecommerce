import Layout from "@/components/layouts/layout";
import { ICart } from "@/interfaces/ICart";
import db from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import {ImCross} from 'react-icons/im'

interface Cart {
  cart: ICart;
}

export default function CartScreen(props: Cart) {
  const { cart } = props;
  console.log(cart);
  return (
    <Layout>
      <div className="w-[90%] lg:w-[50%] mt-5 flex flex-col gap-3">
        {cart?.products?.map((product) => (
          <div
            key={product._id}
            className="flex gap-2 items-center justify-between w-full h-full bg-white rounded-md p-2 shadow-lg relative"
          >
            <button className="bg-black h-6 w-6  rounded-full absolute top-1 left-1 text-white font-bold flex items-center justify-center">
             <ImCross className="text-xs" />
            </button>
            <div className="flex gap-2 items-center">
              <img
                src={product.product.image}
                className="h-[7rem] w-[7rem] object-cover bg-center rounded-md border-[1px] border-gray-200"
              />
              <div className="flex flex-col gap-1 w-[50%]">
                <span className="text-lg text-gray-700">
                  {product.product.name}
                </span>
                <span className="text-2xl font-bold">${product.price}</span>
              </div>
            </div>
            <div className="bg-gray-200 h-full flex flex-col rounded-md">
              <button className="py-1 px-2 text-xl font-bold rounded-md">
                +
              </button>
              <span className="py-1 px-2 text-lg font-semibold">
                {product.quantity}
              </span>
              <button className="py-1 px-2 text-lg font-bold rounded-md">
                -
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-[90%] lg:w-[50%] bottom-0 absolute h-[10rem] flex flex-col justify-around items-center border-t-[1px] border-gray-300">
        <div className="w-full flex justify-between items-center">
          <span className="text-2xl font-bold">Total: </span>
          <span className="text-2xl font-bold">${cart?.totalPrice}</span>
        </div>

        <button className="bg-black text-white text-2xl w-full py-2">
          Order Now
        </button>
      </div>
      <div></div>
    </Layout>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext<any>
) => {
  const session = await getSession(context);

  await db.connect();
  const cart: ICart | null = await Cart.findOne({
    user: session?.user.id,
  })
    .populate({
      path: "products.product",
      model: Product, // <-- specify the model for the "product" field
    })
    .lean();

  await db.disconnect();
  return {
    props: { cart: JSON.parse(JSON.stringify(cart)) },
  };
};
