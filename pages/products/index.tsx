import Layout from "@/components/layouts/layout";
import db from "@/lib/db";
import Product from "@/models/Product";
import React from "react";
import { IProduct } from "../../interfaces/IProduct";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

export default function ProductsScreen({ products }: any) {
  return (
    <Layout>
      <div className="w-full max-h-full flex">
        <div className="md:w-[100%] mt-5 p-2">
          <div className="grid grid-cols-[300px_minmax(600px,_1fr)] gap-4 lg:gap-9 mr-8 ml-8">
            <div className="bg-white border-dashed border-black border-2">
              <span>Filters</span>
            </div>
            <div className="grid grid-cols-[auto_auto] gap-5 md:grid-cols-[auto_auto_auto_auto] text-center">
              {products?.map((product: IProduct) => (
                <Link href={`/products/${product.slug}`} key={product._id}>
                  <div className="bg-white w-[15rem] h-[22rem] m-auto hover:shadow-2xl flex flex-col shadow-lg text-left relative">
                    <img
                      src={product.image}
                      alt="products"
                      className="w-[100%] h-[200px] m-auto mt-0 mb-0"
                    />
                    <span className="font-semibold text-base mt-[20px] ml-3">
                      {product.name}
                    </span>
                    <span className="font-bold text-2xl ml-3">
                      {product.price}$
                    </span>
                    <button className="absolute bottom-[325px] left-[210px]">
                      <BsSuitHeartFill className="text-red-500" size="1.2rem" />
                    </button>
                    <button className="bg-black text-center text-white m-auto mt-[35px] flex items-center justify-center p-1 w-[80%]">
                      <span>Add to cart</span>
                      <FaShoppingCart className="ml-2" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find();
  await db.disconnect();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
