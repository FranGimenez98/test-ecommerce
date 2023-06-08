import CartContext from "@/context/CartContext";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { ImCross } from "react-icons/im";
import { AnimatePresence, motion } from "framer-motion";

interface CartProps {
  setIsOpenCart: (bool: boolean) => void;
  isOpenCart: boolean | undefined;
}

const Cart = ({ setIsOpenCart, isOpenCart }: CartProps) => {
  const { state, dispatch } = useContext(CartContext);
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

  useEffect(() => {
    // Ocultar la barra de desplazamiento y deshabilitar el scroll al montar el componente
    document.body.style.overflow = "hidden";
    // Restaurar el scroll y mostrar la barra de desplazamiento al desmontar el componente
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence>
      
      <div className="w-full h-screen bg-black/30 fixed top-0 right-0 z-30">
        <div
          className="w-full h-full bg-black/30"
          onClick={() => setIsOpenCart(false)}
        />

        {/* sidebar */}
        <motion.div
          className="absolute w-[100%] md:w-[35%] h-full bg-white top-0 right-0 z-50 shadow-2xl transition-transform duration-500 flex items-center flex-col"
          initial={{ transform: "translateX(100%)" }}
          animate={
            isOpenCart
              ? { transform: "translateX(0%)" }
              : { transform: "translateX(100%)" }
          }
          exit={{ transform: "translateX(100%)" }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="w-7 h-7 text-black text-xl absolute top-2 left-2 rounded-full flex items-center justify-center"
            onClick={() => setIsOpenCart(false)}
          >
            <ImCross className="text-sm" />
          </button>
          <h2 className="mt-10 text-xl font-semibold uppercase"> Your Cart</h2>
          <div className="w-full flex flex-col gap-3 h-[65%] overflow-y-scroll px-3">
            {state?.cart?.cartItems.length ? (
              state?.cart?.cartItems?.map((product, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center justify-between w-fullbg-white rounded-md py-1 px-2 shadow-lg relative mt-2 h-[8rem]"
                >
                  <button
                    className="bg-red-500 h-5 w-5  rounded-full absolute top-1 left-1 text-white font-bold flex items-center justify-center"
                    onClick={() => handleRemoveFromCart(product)}
                  >
                    <ImCross className="text-xs" />
                  </button>
                  <div className="flex gap-2 items-center">
                    <img
                      src={product.image}
                      className="h-[6rem] w-[6rem] object-cover bg-center rounded-md border-[1px] border-gray-200"
                    />
                    <div className="flex flex-col gap-1 w-[50%] lg:w-full">
                      <span className="text-lg text-gray-700">
                        {product.name}
                      </span>
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
                      disabled={
                        product.quantity >=
                        (product.sizes.find(
                          (item) => item.size === product.size
                        )?.quantity || 0)
                      }
                    >
                      +
                    </button>
                    <span className="py-1 px-2 text-lg font-semibold flex items-center justify-center">
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
              ))
            ) : (
              <div className="w-full flex items-center justify-center mt-6">
                <span className="text-center">Your cart is empty</span>
              </div>
            )}
          </div>

          {/* <div className="bg-red-500 w-full h-[10rem] absolute bottom-0">d</div> */}
        </motion.div>
        <motion.div
          className="w-[90%] md:w-[35%] z-50 bottom-0 right-0 absolute h-[10rem] flex flex-col justify-around items-center border-t-[1px] border-gray-300 bg-white px-5"
          initial={{ transform: "translateX(100%)" }}
          animate={{ transform: "translateX(0%)" }}
          exit={{ transform: "translateX(100%)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full flex justify-between items-center">
            <span className="text-2xl font-bold">Total: </span>
            <span className="text-2xl font-bold">${totalCartPrice}</span>
          </div>

          {state?.cart?.cartItems.length ? (
            <Link href="/checkout" className="w-full">
              <button className="bg-black text-white text-2xl w-full py-2">
                Order Now
              </button>
            </Link>
          ) : (
            <button
              className="bg-black text-white text-2xl w-full py-2"
              disabled={true}
            >
              Order Now
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Cart;
