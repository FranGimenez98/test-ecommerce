import Layout from "@/components/layouts/layout";
import db from "@/lib/db";
import Product from "@/models/Product";
import React from "react";
import { IProduct } from "../../interfaces/IProduct";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

export default function ProductsScreen({ products }: any) {
  console.log(products);
  return (
    <Layout>
      <div className="w-full max-h-full">
        <h1 className="font-bold text-center text-2xl p-3">Products</h1>
        <div className="md:w-[100%] w-[100%] mt-5 p-0 md:mr-[60px]">
          <div className="font-bold text-center md:grid md:grid-cols-[300px_700px] gap-6 md:ml-[200px]">
            <div className="md:h-[595px] md:w-[300px] md:bg-white">
              <div className="flex md:flex-none mb-2 md:w-[200px] md:m-auto md:mt-[20px] md:shadow">
                <div className="bg-white text-[#828282] border border-[#c7c7c7] md:h-[auto] h-[40px] w-[300px] md:w-[300px] md:row-span-2 flex flex-col justify-center m-auto">
                  <button>SORT</button>
                </div>
                <div className="bg-white text-[#828282] border border-[#c7c7c7] md:h-[auto] h-[40px] w-[300px] md:w-[300px] md:row-span-2 flex flex-col justify-center m-auto">
                  <button>FILTERS</button>
                </div>
              </div>
              <div className="text-[#828282] text-sm mb-3 mt-3">
                {products.length}
                <span className="ml-1">Styles found</span>
              </div>
            </div>
            <div className="flex flex-wrap md:grid md:grid-cols-[auto_auto_auto] w-[100%] gap-2 md:gap-6 md:m-auto">
              {products?.map((product: IProduct) => (
                <Link href={`/products/${product.slug}`} key={product._id}>
                  <div
                    key={product._id}
                    className="bg-white w-[45%] md:w-[100%] h-[50%] md:h-[100%] m-auto hover:shadow-2xl shadow-lg text-left relative"
                  >
                    <img
                      src={product.image}
                      alt="products"
                      className="w-[300px] h-[200px] m-auto mt-0 mb-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-[#828282] font-semibold text-[10px] mt-[10px] ml-2">
                      {product.name}
                    </span>
                    <span className="text-[#828282] font-bold text-[15px] ml-2">
                      {product.price}$
                    </span>
                  </div>
                    <button className="absolute bottom-[260px] left-[140px] md:bottom-[260px] md:left-[190px]">
                      <BsSuitHeartFill className="text-red-500" size="1rem" />
                    </button>
                    <button className="bg-black text-[10px] text-center text-white m-auto mt-[5px] mb-[10px] flex items-center justify-center p-1 w-[80%]">
                      <span>Add to cart</span>
                      <FaShoppingCart className="ml-2" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* </div> */}
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
