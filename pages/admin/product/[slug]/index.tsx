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
import AdminLayout from "@/components/layouts/adminLayout";
import { MdDeleteForever } from "react-icons/md";
import ModalEditProduct from "@/components/ModalEditProduct";

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
  const { sex, category, color } = product;
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

  function capitalizeFirstLetter(string: any) {
    if (!string) return ""; // Si la cadena es nula o vacía, retornarla sin cambios
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <AdminLayout>
      <section className="md:w-[70%] w-[99%] min-h-[calc(100vh-4rem)] bg-white mt-9 mr-[50px] m-auto ml-[320px]">
        <div className="w-full h-full flex flex-col md:flex-row p-2 gap-0 md:gap-10">
          <div className="w-full flex flex-col-reverse md:flex-row md:gap-2 h-full">
            <div className=" md:w-[27rem] md:h-[32rem] relative">
              <img
                src={product?.image}
                className=" md:w-full md:h-full object-cover bg-center"
              />
              <h2 className="text-3xl font-semibold mt-4 md:mt-0">
                {product?.name}
              </h2>
              <h3>For {sex}</h3>
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
                <p className="text-gray-500 mb-6">
                  {capitalizeFirstLetter(product?.description)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className="flex md:flex-row items-start gap-1 md:gap-2 mt-2 md:m-0">
              <div className="bg-red-500 w-[5.5rem] h-[5rem] md:h-[7.6rem] md:w-[7.6rem]"></div>
              <div className="bg-red-500 w-[5.5rem] h-[5rem] md:h-[7.6rem] md:w-[7.6rem]"></div>
              <div className="bg-red-500 w-[5.5rem] h-[5rem] md:h-[7.6rem] md:w-[7.6rem]"></div>
              <div className="bg-red-500 w-[5.5rem] h-[5rem] md:h-[7.6rem] md:w-[7.6rem]"></div>
            </div>
            <div className="flex flex-row justify-end mt-4">
              <ModalEditProduct/>
              <MdDeleteForever
                size="1.2rem"
                className="text-red-600 cursor-pointer ml-2"
              />
            </div>
            <div className="flex flex-row items-center mt-[20px]">
              <h3 className=" text-lg mr-1">Category:</h3>
              <span className="text-black font-semibold uppercase text-sm">
                {category ? category?.name : ""}
              </span>
            </div>
            <div className="flex flex-row items-center">
              <h3 className="text-lg mr-1">Color:</h3>
              <span className="text-black font-semibold uppercase text-sm">
                {color?.name}
              </span>
            </div>
            <div>
              {product.discount?.isActive ? (
                <div className="w-full flex flex-col gap-2 mt-0">
                  <span className="text-lg">
                    Original price:{" "}
                    <span className="font-normal text-xl line-through text-gray-600">
                      ${product.price}
                    </span>
                  </span>

                  <div className="">
                    <span className="text-lg">
                      Discount: <b className="text-green-600">Enabled</b>
                    </span>
                  </div>
                  <div>
                    <span className="text-lg">Discount percentage:</span>
                    <span className="text-xl items-center ml-1">
                      %{product.discount.value} OFF
                    </span>
                  </div>

                  <div>
                    <span className="text-black font-normal text-lg">
                      Price with discount:
                      <span className="font-semibold text-xl ml-1">
                        ${product.price * (1 - product.discount.value / 100)}
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-2 mt-0">
                  <span className="text-lg">
                    Original price:{" "}
                    <span className="font-normal text-xl line-through text-gray-600">
                      ${product.price}
                    </span>
                  </span>

                  <div className="">
                    <span className="text-lg">
                      Discount: <b className="text-red-600">Disabled</b>
                    </span>
                  </div>
                  <div>
                    <span className="text-lg">Discount percentage:</span>
                    <span className="items-center text-xl ml-2">%0 OFF</span>
                  </div>
                </div>
              )}
              <div>
                <span className="text-lg mt-3">
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
            </div>
            {/* <span className="text-2xl">${product?.price}</span> */}
            {/* <p>{product.description}</p> */}
            <div>
              <span className="text-black font-semibold uppercase text-ms mb-2 mt-3 items-center">
                Stock Size:
                <span className="text-xl ml-2">{product.stock}</span>
              </span>
              <div className="flex gap-3 w-[100%] mt-4">
                {product?.sizes.map((size, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`shadow-sm border-[1px] w-[100%] text-center border-slate-300 text-black text-xl px-4 py-2 ${
                        size.quantity === 0 && "bg-gray-300"
                      }${
                        sizeSelected === size.size ? " bg-black text-white" : ""
                      }`}
                    >
                      {size.size}
                    </div>
                    {size.quantity > 0 && (
                      <div className="absolute font-bold top-0 right-0 -mt-2 -mr-2 h-5 w-5 bg-red-500 text-white flex items-center justify-center rounded-full text-sm">
                        {size.quantity}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
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
  })
    .select("name slug price sizes image description sex stock rating discount")
    .populate("category", "name")
    .populate("color", "name")
    .lean();

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
  const favoriteProductIds = favorites.map(
    (favorite) => favorite?.product?._id
  );

  return {
    props: {
      product: product ? toJSON(product) : null,
      relatedProducts: relatedProducts ? toJSON(relatedProducts) : null,
      favorites: favoriteProductIds ? toJSON(favoriteProductIds) : null,
    },
  };
}
