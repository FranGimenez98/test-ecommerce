import React, { useContext, useState } from "react";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { IoFilter } from "react-icons/io5";
import Link from "next/link";
import { IProduct } from "@/interfaces/IProduct";
import CartContext from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: IProduct;
  userFavs: string[];
  toggleFavorite: (productId: string, productName: string) => void;
  handleAddToCart: (product: IProduct, size: string, quantity: number) => void;
  showSizes: boolean[];
  setShowSizes: React.Dispatch<React.SetStateAction<boolean[]>>;
  index: number;
  setIsOpenWishlistMessage?: (bool: boolean) => void | undefined;
}

export const ProductCardHome = ({
  product,
  userFavs,
  toggleFavorite,
  handleAddToCart,
  showSizes,
  setShowSizes,
  index,
  setIsOpenWishlistMessage,
}: ProductCardProps) => {
  const { data: session } = useSession();
  const { state, dispatch } = useContext(CartContext);
  const [openSizeSelector, setOpenSizeSelector] = useState(false);

  const onMouseEnter = () => {
    const updatedShowSizes = [...showSizes];
    updatedShowSizes[index] = true;
    setShowSizes(updatedShowSizes);
  };

  const onMouseLeave = () => {
    const updatedShowSizes = [...showSizes];
    updatedShowSizes[index] = false;
    setShowSizes(updatedShowSizes);
  };

  return (
    <div
      key={product._id}
      className="bg-white w-[11rem] md:w-[100%] h-[262px] md:h-[100%] m-auto text-left relative md:mb-5 mb-20"
    >
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative"
      >
        <Link href={`/products/${product.slug}`}>
          <img
            src={product.image}
            alt="products"
            className="w-[11rem] md:w-[300px] h-[18rem] md:h-[25rem] m-auto mt-0 mb-0 object-cover bg-center"
          />
        </Link>

        {/* Mobile Sizes */}
        {openSizeSelector && (
          <div className="md:hidden absolute bottom-0 left-0 right-0 p-2 bg-white text-gray-700 m-1.5 flex flex-col ">
            <h3 className="font-semibold text-center uppercase text-sm mb-1">
              Quick Cart
            </h3>
            <div className="grid grid-cols-4 gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size.size}
                  disabled={size.quantity === 0}
                  className={`border-[1px] border-slate-200 ${
                    size.quantity === 0 && "bg-gray-200 text-gray-400"
                  } ${
                    state.cart.cartItems.some(
                      (item) =>
                        item.slug === product.slug && item.size === size.size
                    ) && "bg-black text-white"
                  }`}
                  onClick={() => handleAddToCart(product, size.size, 1)}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {showSizes[index] && (
          <div className="hidden md:flex md:flex-col absolute bottom-0 left-0 right-0 p-2 bg-white text-gray-700 m-1.5 opacity-90">
            <h3 className="font-semibold text-center uppercase text-sm mb-1">
              Quick Cart
            </h3>
            <div className="grid grid-cols-4 gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size.size}
                  disabled={size.quantity === 0}
                  className={`border-[1px] border-slate-200 ${
                    size.quantity === 0 && "bg-gray-200 text-gray-400"
                  } ${
                    state.cart.cartItems.some(
                      (item) =>
                        item.slug === product.slug && item.size === size.size
                    ) && "bg-black text-white"
                  }`}
                  onClick={() => handleAddToCart(product, size.size, 1)}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col px-2">
        <Link href={`/products/${product.slug}`}>
          <span className="text-base font-semibold uppercase text-gray-700">
            {product.name}
          </span>
        </Link>

        {product.discount?.isActive ? (
          <span className="font-semibold text-lg">
            ${product.price * (1 - product.discount.value / 100)}{" "}
            <span className="text-red-500 line-through">${product.price}</span>
          </span>
        ) : (
          <span className="font-semibold text-lg">${product.price} </span>
        )}
      </div>
      {session ? (
        userFavs.includes(product._id) ? (
          <motion.div
            className="absolute z-10 w-7 h-7 right-2 top-2 bg-white rounded-full flex items-center justify-center shadow-md"
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.5 }}
          >
            <button
              className="bottom-[90%] left-[85%] md:bottom-[92%] md:left-[90%] w-full h-full flex items-center justify-center rounded-full"
              onClick={() => toggleFavorite(product._id, product.name)}
            >
              <BsSuitHeartFill className="text-red-500" size="1rem" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="absolute z-10 w-7 h-7 right-2 top-2 bg-white rounded-full flex items-center justify-center shadow-md"
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.5 }}
          >
            <button
              className=" bottom-[90%] left-[85%] md:bottom-[92%] md:left-[90%] w-full h-full flex items-center justify-center rounded-full"
              onClick={() => toggleFavorite(product._id, product.name)}
            >
              <BsSuitHeart className="text-black" size="1rem" />
            </button>
          </motion.div>
        )
      ) : (
        <div className="absolute z-10 w-7 h-7 right-2 top-2 bg-white rounded-full flex items-center justify-center shadow-md">
          <button
            className=" bottom-[90%] left-[85%] md:bottom-[92%] md:left-[90%]"
            onClick={() => {
              if (setIsOpenWishlistMessage) {
                setIsOpenWishlistMessage(true);
              }
            }}
          >
            <BsSuitHeart className="text-black" size="1rem" />
          </button>
        </div>
      )}

      <div className="md:hidden absolute z-10 w-7 h-7 left-2 top-2 bg-white rounded-full flex items-center justify-center shadow-md">
        <button
          className={`bottom-[90%] left-[85%] md:bottom-[92%] md:left-[90%] w-full h-full rounded-full flex items-center justify-center ${
            openSizeSelector ? "bg-black text-white" : "bg-white text-black"
          }`}
          onClick={() => setOpenSizeSelector(!openSizeSelector)}
        >
          <IoFilter
            className={`${
              openSizeSelector ? "bg-black text-white" : "bg-white text-black"
            }`}
            size="1rem"
          />
        </button>
      </div>
    </div>
  );
};
