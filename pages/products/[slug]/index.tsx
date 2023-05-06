import Layout from "@/components/layouts/layout";
import { IProduct } from "@/interfaces/IProduct";
import db from "@/lib/db";
import Product from "@/models/Product";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

interface Product {
  product: IProduct;
  products: IProduct[];
}

export default function ProductScreen(props: Product) {
  const { product, products } = props;

  const [sizeSelected, setSizeSelected] = useState("");
  const [counter, setCounter] = useState(0);
  const [error, setError] = useState(false);

  const handleSizeSelected = (size: string) => {
    setSizeSelected(size);
    setError(false);
  };

  const handleCounter = (counter: number) => {
    if (counter >= 0 && counter <= getSizeQuantity()) {
      setCounter(counter);
      setError(false);
    } else {
      setError(true);
    }
  };

  const getSizeQuantity = () => {
    const size = product.sizes.find((size) => size.size === sizeSelected);
    return size ? size.quantity : 0;
  };

  return (
    <Layout>
      <section className="w-[97%] bg-white mt-2">
        <div className="w-full h-full flex flex-col md:flex-row items-center p-2 gap-2 ">
          <div className="w-full flex flex-col">
            <img
              src={product.image}
              className="h-[30rem] object-cover bg-center"
            />
            <div className="flex w-full gap-2 mt-2">
              <div className="bg-red-500 h-[8rem] w-full"></div>
              <div className="bg-red-500 h-[8rem] w-full"></div>
              <div className="bg-red-500 h-[8rem] w-full"></div>
            </div>
          </div>
          <div className="flex flex-col justify-center w-full h-full gap-1">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <span className="text-2xl">${product.price}</span>
            {/* <p>{product.description}</p> */}
            <div className="flex gap-2 w-[70%]">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => handleSizeSelected(size.size)}
                  className={`bg-black text-white text-xl px-2 py-1 ${
                    size.quantity === 0 && "bg-gray-300"
                  }${sizeSelected === size.size ? " bg-green-500" : ""}`}
                  disabled={size.quantity === 0}
                >
                  {size.size}
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <div className=" flex border-[1px] border-gray-400">
                <button
                  className="w-10 h-[2.5rem] text-xl flex items-center justify-center font-semibold"
                  onClick={() => handleCounter(counter - 1)}
                  disabled={counter === 0}
                >
                  -
                </button>
                <div className="w-10 flex items-center justify-center border-x-[1px] border-gray-400">
                  <span className="font-semibold">{counter}</span>
                </div>
                <button
                  className="w-10 h-[2.5rem] text-xl flex items-center justify-center font-semibold"
                  onClick={() => handleCounter(counter + 1)}
                >
                  +
                </button>
              </div>
              <button className="bg-black w-full text-center text-white flex items-center justify-center p-1 text-xl">
                <span>Add to cart</span>
                <FaShoppingCart className="ml-2" />
              </button>
            </div>
            {error && (
              <div className="w-full">
                <p className="text-red-500">{`El talle ${sizeSelected} no cuenta con mas stock.`}</p>
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold">Descripcion: </h2>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
        <div className="mt-10 w-full p-2">
          <div className="grid grid-cols-2 gap-2">
            {products.map((product) => (
              <Link href={`/products/${product.slug}`} key={product._id}>
                <div className="h-[15rem] w-full mb-20">
                  <img
                    src={product.image}
                    className="h-full w-full object-cover bg-center"
                  />
                  <div className="flex flex-col items-center mt-1 shadow-md">
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
  context: GetServerSidePropsContext<any>
) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product: IProduct | null = await Product.findOne({ slug: slug }).lean();
  console.log(product);
  const products: IProduct[] | undefined = await Product.find({
    category: product?.category,
    slug: { $ne: product?.slug },
  }).limit(4);
  await db.disconnect();
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
