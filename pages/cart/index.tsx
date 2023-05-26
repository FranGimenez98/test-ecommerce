import Layout from "@/components/layouts/layout";
import CartContext from "@/context/CartContext";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { ImCross } from "react-icons/im";

export default function CartScreen() {
  const { state, dispatch } = useContext(CartContext);
  console.log(state.cart.cartItems)
  const handleRemoveFromCart = (item: any) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const handleUpdateQuantity = (
    id: string,
    size: string,
    newQuantity: number
  ) => {
    dispatch({
      type: "CART_UPDATE_ITEM_QUANTITY",
      payload: { id, size, quantity: newQuantity },
    });
  };

  const totalCartPrice = state?.cart?.cartItems.reduce(
    (a, c) => a + c.quantity * c.price,
    0
  );

  return (
    <Layout>
      <div className="w-[95%] lg:w-[50%] mt-5 flex flex-col gap-3">
        {state?.cart?.cartItems?.map((product, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between w-full h-full bg-white rounded-md p-2 shadow-lg relative"
          >
            <button
              className="bg-black h-6 w-6  rounded-full absolute top-1 left-1 text-white font-bold flex items-center justify-center"
              onClick={() => handleRemoveFromCart(product)}
            >
              <ImCross className="text-xs" />
            </button>
            <div className="flex gap-2 items-center">
              <img
                src={product.image}
                className="h-[7rem] w-[7rem] object-cover bg-center rounded-md border-[1px] border-gray-200"
              />
              <div className="flex flex-col gap-1 w-[50%] lg:w-full">
                <span className="text-lg text-gray-700">{product.name}</span>
                <span>Size {product.size}</span>
                <span className="text-2xl font-bold">
                  ${product.price * product.quantity}
                </span>
              </div>
            </div>
            <div className="bg-gray-200 h-full flex flex-col rounded-md">
              <button
                className="py-1 px-2 text-xl font-bold rounded-md"
                onClick={() =>
                  handleUpdateQuantity(
                    product._id,
                    product.size,
                    product.quantity + 1
                  )
                }
                disabled={product.quantity >= product.stock}
              >
                +
              </button>
              <span className="py-1 px-2 text-lg font-semibold">
                {product.quantity}
              </span>
              <button
                className="py-1 px-2 text-lg font-bold rounded-md"
                onClick={() =>
                  handleUpdateQuantity(
                    product._id,
                    product.size,
                    product.quantity - 1
                  )
                }
                disabled={product.quantity === 0}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-[90%] lg:w-[50%] bottom-0 absolute h-[10rem] flex flex-col justify-around items-center border-t-[1px] border-gray-300">
        <div className="w-full flex justify-between items-center">
          <span className="text-2xl font-bold">Total: </span>
          <span className="text-2xl font-bold">${totalCartPrice}</span>
        </div>

        <Link href="/checkout" className="w-full">
          <button className="bg-black text-white text-2xl w-full py-2">
            Order Now
          </button>
        </Link>
      </div>
      <div></div>
    </Layout>
  );
}
