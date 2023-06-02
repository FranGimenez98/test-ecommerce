import Layout from "@/components/layouts/layout";
import CartContext from "@/context/CartContext";
import useError from "@/hooks/useError";
import { IProduct } from "@/interfaces/IProduct";
import { connect } from "@/lib/db";
import toJSON from "@/lib/toJSON";
import Product from "@/models/Product";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useContext, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import Favorite from "@/models/Favorite";
import { getSession, useSession } from "next-auth/react";

interface Product {
  product: IProduct;
  relatedProducts: IProduct[];
  favorites: string[];
}

export default function ProductScreen({
  product,
  relatedProducts,
  favorites,
}: Product) {
  const { data: session } = useSession();
  const { state, dispatch } = useContext(CartContext);

  const [sizeSelected, setSizeSelected] = useState("");
  const [counter, setCounter] = useState(0);
  const [userFavs, setUserFavs] = useState(favorites.map((fav: any) => fav));
  console.log("product", userFavs);
  const { error, errorMessage, showError, hideError } = useError();

  const handleSizeSelected = (size: string) => {
    setSizeSelected(size);
    setCounter(0);
    hideError();
  };

  const handleCounter = ({
    counter,
    size,
  }: {
    counter: number;
    size: string;
  }) => {
    if (counter >= 0 && counter <= getSizeQuantity()) {
      setCounter(counter);
      hideError();
    } else {
      showError(`El talle ${size} no cuenta con mas stock`);
    }
  };

  const getSizeQuantity = () => {
    const size = product.sizes.find((size) => size.size === sizeSelected);
    return size ? size.quantity : 0;
  };

  const handleAddToCart = () => {
    if (sizeSelected === "") return showError("Selecciona un talle");
    if (counter === 0) return showError("Selecciona una cantidad de productos");

    const existingItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug && item.size === sizeSelected
    );

    if (existingItem) {
      // Actualizar la cantidad del producto existente
      const size = product.sizes.find((item) => item.size === sizeSelected);

      if (!size || counter + existingItem.quantity > size.quantity) {
        return showError("No hay suficiente stock para actualizar al carrito");
      }

      const updatedCartItems = state.cart.cartItems.map((item) =>
        item.slug === product.slug && item.size === sizeSelected
          ? { ...item, quantity: item.quantity + counter }
          : item
      );

      dispatch({ type: "CART_UPDATE_ITEM", payload: updatedCartItems });
    } else {
      // Agregar un nuevo producto al carrito
      const size = product.sizes.find((item) => item.size === sizeSelected);

      if (!size || counter > size.quantity) {
        return showError("No hay suficiente stock para agregar al carrito");
      }

      const newItem = { ...product, quantity: counter, size: sizeSelected };
      dispatch({ type: "CART_ADD_ITEM", payload: newItem });
    }
  };

  const toggleFavorite = async (productId: string) => {
    const isFavorite = userFavs.includes(productId);
    if (isFavorite) {
      try {
        await fetch(
          `/api/favorites/delete/${session?.user.id}?productId=${productId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setUserFavs((prevFavorites: any) =>
          prevFavorites.filter((fav: any) => fav !== productId)
        );
      } catch (error) {
        console.error("Error deleting favorite:", error);
        // Realiza alguna acción en caso de error al eliminar de favoritos
      }
    } else {
      try {
        await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: session?.user.id, productId }),
        });
        setUserFavs((prevFavorites: any) => [...prevFavorites, productId]);
      } catch (error) {
        console.error("Error adding favorite:", error);
        // Realiza alguna acción en caso de error al agregar a favoritos
      }
    }
  };

  return (
    <Layout>
      <section className="md:w-[91%] w-[99%] min-h-[calc(100vh-4rem)] bg-white mt-9">
        <div className="w-full h-full flex flex-col md:flex-row p-2 gap-2 md:gap-10">
          <div className="w-full flex flex-col-reverse md:flex-row md:gap-2 h-full">
            <div className="flex md:flex-col items-start gap-1 md:gap-2 mt-2 md:m-0">
              <div className="bg-red-500 w-[5.5rem] h-[5rem] md:h-[7.6rem] md:w-[7.6rem]"></div>
              <div className="bg-red-500 w-[5.5rem] h-[5rem] md:h-[7.6rem] md:w-[7.6rem]"></div>
              <div className="bg-red-500 w-[5.5rem] h-[5rem] md:h-[7.6rem] md:w-[7.6rem]"></div>
              <div className="bg-red-500 w-[5.5rem] h-[5rem] md:h-[7.6rem] md:w-[7.6rem]"></div>
            </div>
            <div className=" md:w-[27rem] md:h-[32rem] relative">
              <img
                src={product?.image}
                className=" md:w-full md:h-full object-cover bg-center"
              />
              {product.discount?.isActive && (
                <div className="text-xl absolute top-2 left-2 bg-black text-white uppercase font-bold px-2">
                  SALE!
                </div>
              )}
              <button
                className="absolute z-10 w-9 h-9 md:w-7 md:h-7 right-2 top-2 bg-white rounded-full flex items-center justify-center shadow-md"
                onClick={() => toggleFavorite(product._id)}
              >
                {userFavs.includes(product._id) ? (
                  <BsSuitHeartFill className="text-red-500 text-[1.5rem] md:text-[1rem]" />
                ) : (
                  <BsSuitHeart className="md:text-[1rem] text-[1.5rem]" />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col w-full gap-1">
            <h2 className="text-3xl font-semibold mt-4 md:mt-0">
              {product?.name}
            </h2>
            <div className="flex">
              {Array.from({ length: product.rating }, (_, index) => (
                <AiFillStar key={index} className="text-yellow-500 text-xl" />
              ))}
              {Array.from({ length: 5 - product.rating }, (_, index) => (
                <AiOutlineStar
                  key={index}
                  className="text-yellow-500 text-xl"
                />
              ))}
            </div>
            <div>
              <p className="text-gray-500 mb-6">{product?.description}</p>
            </div>
            {product.discount?.isActive ? (
              <div className="w-full flex gap-2 items-center ">
                <span className="font-semibold text-2xl">
                  ${product.price * (1 - product.discount.value / 100)}{" "}
                  <span className="text-gray text-lg text-gray-400 font-normal line-through">
                    ${product.price}
                  </span>
                </span>

                <div className="bg-red-500 h-[1.2rem] text-white flex items-center justify center px-2">
                  <span className="text-sm">%{product.discount.value} OFF</span>
                </div>
              </div>
            ) : (
              <span className="font-semibold text-2xl">${product.price} </span>
            )}
            <div>
              <span className="text-gray-500 text-sm">
                Availability{" "}
                {product.stock > 0 ? (
                  <span className="text-black font-semibold uppercase text-sm">
                    In Stock
                  </span>
                ) : (
                  <span>No Stock</span>
                )}
              </span>
            </div>
            {/* <span className="text-2xl">${product?.price}</span> */}
            {/* <p>{product.description}</p> */}
            <div className="flex gap-2 w-[70%] mt-5">
              {product?.sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => handleSizeSelected(size.size)}
                  className={`shadow-sm border-[1px] min-w-[2.5rem] border-slate-300 text-black text-xl px-2 py-1 ${
                    size.quantity === 0 && "bg-gray-300"
                  }${sizeSelected === size.size ? " bg-black text-white" : ""}`}
                  disabled={size.quantity === 0}
                >
                  {size.size}
                </button>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <div className=" flex border-[1px] border-slate-300 shadow-sm">
                <button
                  className="w-10 h-[2.5rem] text-xl flex items-center justify-center font-semibold"
                  onClick={() =>
                    handleCounter({ counter: counter - 1, size: sizeSelected })
                  }
                  disabled={counter === 0}
                >
                  -
                </button>
                <div className="w-10 flex items-center justify-center border-x-[1px] border-slate-300">
                  <span className="font-semibold">{counter}</span>
                </div>
                <button
                  className="w-10 h-[2.5rem] text-xl flex items-center justify-center font-semibold"
                  onClick={() =>
                    handleCounter({ counter: counter + 1, size: sizeSelected })
                  }
                >
                  +
                </button>
              </div>
              <button
                className="bg-black w-full md:w-[12rem] text-center text-white flex items-center justify-center p-1 text-xl"
                onClick={handleAddToCart}
              >
                <span>Add to cart</span>
                <FaShoppingCart className="ml-2" />
              </button>
            </div>
            {error && (
              <div className="w-full">
                <p className="text-red-500">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-32 w-full p-1">
          <h1 className="text-xl font-semibold mb-1 md:mb-4">
            You might be interested in
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {relatedProducts?.map((product) => (
              <Link href={`/products/${product.slug}`} key={product._id}>
                <div className="h-[20rem] md:h-[25rem] w-full mb-20">
                  <img
                    src={product.image}
                    className="h-full w-full object-cover bg-center"
                  />
                  <div className="flex flex-col items-center mt-1">
                    <p className="text-center">{product?.name}</p>
                    <span>${product?.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const { slug } = context.params!;
  const session = await getSession({ req: context.req });
  await connect();

  const product: IProduct | null | undefined = await Product.findOne({
    slug: slug,
  }).lean();

  const relatedProducts: IProduct[] | null | undefined = await Product.find({
    category: product?.category,
    slug: { $ne: product?.slug },
  })
    .limit(4)
    .lean();

  const favorites = await Favorite.find({ user: session?.user.id })
    .populate("product")
    .select("_id")
    .lean();
  const favoriteProductIds = favorites.map((favorite) => favorite?.product?._id);

  return {
    props: {
      product: product ? toJSON(product) : null,
      relatedProducts: relatedProducts ? toJSON(relatedProducts) : null,
      favorites: favoriteProductIds ? toJSON(favoriteProductIds) : null,
    },
  };
}
