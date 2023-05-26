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

export interface HomeProps {
  products: IProduct[];
}

interface NotificationType {
  isOpen: boolean;
  type: "approved" | "failure" | null;
  content: string;
}

export default function Home(props: HomeProps) {
  const { state, dispatch } = useContext(CartContext);
  const { data: session } = useSession();
  const { products } = props;
  const [notification, setNotification] = useState<NotificationType>({
    isOpen: false,
    type: null,
    content: "",
  });

  console.log(notification);

  console.log(state);

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

  return (
    <Layout>
      <section className="min-h-screen w-full flex flex-col items-center">
        <Hero />
        <div className="md:w-[97%] mt-5 w-full bg-white p-2 shadow-lg rounded-sm">
          <h2 className="my-2 text-4xl font-semibold mb-3">New arrivals.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products?.map((product, index) => (
              <Link href={`/products/${product.slug}`} key={index}>
                <div className="flex flex-col relative">
                  {/* <div className="absolute z-10 w-7 h-7 right-2 top-2 bg-white rounded-full flex items-center justify-center">
                    <AiOutlineHeart className="text-2xl" />
                    <AiFillHeart className="text-2xl text-red-500" />
                  </div> */}
                  <div className="h-[28rem] overflow-hidden">
                    <img
                      src={product.image}
                      className="h-full w-full object-cover bg-center hover:scale-110 ease-in-out transition"
                    />
                  </div>

                  <div className="h-[4.5rem] flex flex-col px-2 py-1">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <div className="w-full flex justify-between">
                      <span className="text-lg text-emerald-500 font-semibold">
                        ${product.price}
                      </span>
                      {/* <button className="bg-black text-white py-1 px-2">Add to cart</button> */}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* <div className="flex items-center flex-col">
            <h2 className="text-4xl font-semibold">Start Exploring</h2>
            <div className="flex gap-4 justify-center items-center bg-black text-white">
              <button className="w-28">Men</button>
              <button className="w-28">Women</button>
              <button className="w-28">Sports</button>
            </div>
          </div>
          <div className="flex gap-4 w-full h-full">
            <div className="w-full h-[25rem] shadow-md flex flex-col">
              <p>10 products</p>
              <div className="w-full">
                
              </div>
            </div>
            <div className="w-full h-[25rem] shadow-md">k</div>
            <div className="w-full h-[25rem] shadow-md">k</div>
          </div> */}
        </div>
      </section>
    </Layout>
  );
}

const CACHE_DURATION = 60 * 60; // Duración en segundos de la caché

async function getProducts(): Promise<IProduct[]> {
  await connect();
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("name price image slug"); // Solo se devuelven los campos necesarios

  return products;
}

export async function getStaticProps() {
  const products = await getProducts(); // Se obtienen los productos
  return {
    props: {
      products: toJSON(products),
    },
    revalidate: CACHE_DURATION, // Se almacena en caché durante un tiempo determinado
  };
}
