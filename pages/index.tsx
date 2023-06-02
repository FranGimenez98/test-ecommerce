import Hero from "@/components/hero";
import Layout from "@/components/layouts/layout";
import { IProduct } from "@/interfaces/IProduct";
import { connect } from "@/lib/db";
import toJSON from "@/lib/toJSON";
import Product from "@/models/Product";
import { useSession, getSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import CartContext from "@/context/CartContext";
import { NextApiRequest } from "next";
import Favorite from "@/models/Favorite";
import ProductCard from "@/components/productCard";
import { ProductCardHome } from "@/components/productCardHome";

export interface HomeProps {
  products: IProduct[];
  favorites: string[];
  populars: IProduct[];
  onSale: IProduct[];
}

interface NotificationType {
  isOpen: boolean;
  type: "approved" | "failure" | null;
  content: string;
}

export default function Home({
  products,
  favorites,
  populars,
  onSale,
}: HomeProps) {
  const { state, dispatch } = useContext(CartContext);
  const [userFavs, setUserFavs] = useState(favorites.map((fav: any) => fav));
  const [showSizes, setShowSizes] = useState(
    Array(products.length).fill(false)
  );
  const [showSizesPopulars, setShowSizesPopulars] = useState(
    Array(populars.length).fill(false)
  );
  const [showSizesOnSale, setShowSizesOnSale] = useState(
    Array(onSale.length).fill(false)
  );
  const [openCategories, setOpenCategories] = useState(false);
  const { data: session } = useSession();
  const [notification, setNotification] = useState<NotificationType>({
    isOpen: false,
    type: null,
    content: "",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    if (status === "approved") {
      setNotification({
        content: "Pago aprobado!",
        isOpen: true,
        type: "approved",
      });
    } else if (status === "failure") {
      setNotification({
        content: "Pago fallido!",
        isOpen: true,
        type: "failure",
      });
    }

    const notificationTimeout = setTimeout(() => {
      setNotification({
        isOpen: false,
        type: null,
        content: "",
      });
    }, 5000);

    return () => {
      clearTimeout(notificationTimeout);
    };
  }, []);

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
      }
    }
  };

  const handleAddToCart = (product: any, size: any, quantity: any) => {
    const existingItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug && item.size === size
    );

    const selectedSize = product.sizes.find((item: any) => item.size === size);
    if (!selectedSize)
      return console.log("No se encontró el tamaño seleccionado");

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + 1;
      if (selectedSize.quantity < updatedQuantity) {
        return console.log(
          "No hay suficiente stock para actualizar el carrito"
        );
      }

      dispatch({
        type: "CART_UPDATE_ITEM_QUANTITY",
        payload: {
          id: existingItem._id, // o el identificador único del elemento del carrito
          size,
          quantity: updatedQuantity,
        },
      });
    } else {
      if (selectedSize.quantity < quantity) {
        return console.log("No hay suficiente stock para agregar al carrito");
      }

      const newItem = { ...product, quantity, size };
      dispatch({ type: "CART_ADD_ITEM", payload: newItem });
    }
  };

  return (
    <Layout>
      <section className="min-h-screen w-full flex flex-col items-center">
        <Hero />
        {populars.length ? (
          <div className="md:w-[91%] mt-5 w-full">
            <div className="w-full flex justify-between items-end">
              <h2 className="my-2 text-2xl font-bold uppercase">POPULARS</h2>
              <Link href="/products?rating=5" className="font-bold underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {populars?.map((product, index) => (
                <ProductCardHome
                  key={product._id}
                  product={product}
                  userFavs={userFavs}
                  toggleFavorite={toggleFavorite}
                  handleAddToCart={handleAddToCart}
                  showSizes={showSizesPopulars}
                  setShowSizes={setShowSizesPopulars}
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <div className="md:w-[91%] mt-5 w-full">
          <div className="w-full flex justify-between items-end">
            <h2 className="my-2 text-2xl font-bold uppercase">Sale</h2>
            <Link href="/products?sort=newest" className="font-bold underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {onSale?.map((product, index) => (
              <ProductCardHome
                key={product._id}
                product={product}
                userFavs={userFavs}
                toggleFavorite={toggleFavorite}
                handleAddToCart={handleAddToCart}
                showSizes={showSizesOnSale}
                setShowSizes={setShowSizesOnSale}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="md:w-[91%] mt-5 w-full">
          <div className="w-full flex justify-between items-end">
            <h2 className="my-2 text-2xl font-bold uppercase">New arrivals</h2>
            <Link href="/products?sort=newest" className="font-bold underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products?.map((product, index) => (
              <ProductCardHome
                key={product._id}
                product={product}
                userFavs={userFavs}
                toggleFavorite={toggleFavorite}
                handleAddToCart={handleAddToCart}
                showSizes={showSizes}
                setShowSizes={setShowSizes}
                index={index}
              />
              // <Link href={`/products/${product.slug}`} key={index}>
              //   <div className="flex flex-col relative">
              //     <div className="absolute z-10 w-7 h-7 right-2 top-2 bg-white rounded-full flex items-center justify-center shadow-md">
              //       <AiOutlineHeart className="text-xl" />
              //       {/* <AiFillHeart className="text-xl text-red-500" /> */}
              //     </div>
              //     <div className="h-[23rem] overflow-hidden">
              //       <img
              //         src={product.image}
              //         className="h-full w-full object-cover bg-center hover:scale-110 ease-in-out transition"
              //       />
              //     </div>

              //     <div className="h-[4.5rem] flex flex-col px-2 py-1 bg-white">
              //       <h2 className="text-base font-semibold uppercase text-gray-700">
              //         {product.name}
              //       </h2>
              //       <div className="w-full flex justify-between">
              //         <span className="font-semibold text-lg">
              //           ${product.price}
              //         </span>
              //         {/* <button className="bg-black text-white py-1 px-2">Add to cart</button> */}
              //       </div>
              //     </div>
              //   </div>
              // </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

// const CACHE_DURATION = 60 * 60; // Duración en segundos de la caché

// async function getProducts(): Promise<IProduct[]> {
//   await connect();
//   const products = await Product.find()
//     .sort({ createdAt: -1 })
//     .limit(4)
//     .select("name price image slug"); // Solo se devuelven los campos necesarios

//   return products;
// }

// export async function getStaticProps() {
//   const products = await getProducts(); // Se obtienen los productos
//   return {
//     props: {
//       products: toJSON(products),
//     },
//     revalidate: CACHE_DURATION, // Se almacena en caché durante un tiempo determinado
//   };
// }

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const session = await getSession({ req });
  await connect();
  const [relatedProducts, favorites, populars, onSale] = await Promise.all([
    Product.find().sort({ createdAt: -1 }).limit(4),
    Favorite.find({ user: session?.user?.id })
      .populate("product", "-reviews")
      .select("product")
      .lean()
      .exec(),
    Product.find({ rating: 5 }).sort({ createdAt: -1 }).limit(4),
    Product.find({
      "discount.isActive": true,
    })
      .sort({ createdAt: -1 })
      .limit(4),
  ]);

  console.log("pop", populars);
  const favoriteProductIds = favorites?.map(
    (favorite: any) => favorite?.product?._id
  );

  return {
    props: {
      products: relatedProducts ? toJSON(relatedProducts) : null,
      favorites: favorites ? toJSON(favoriteProductIds) : null,
      populars: populars ? toJSON(populars) : null,
      onSale: onSale ? toJSON(onSale) : null,
    },
  };
}
