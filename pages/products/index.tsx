import Layout from "@/components/layouts/layout";
import { connect } from "@/lib/db";
import Product from "@/models/Product";
import React from "react";
import { IProduct } from "../../interfaces/IProduct";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import toJSON from "@/lib/toJSON";

export default function ProductsScreen({ products }: any) {
  return (
    <Layout>
      <div className="w-full max-h-full">
        <h1 className="font-bold text-center text-2xl p-3">Products</h1>
        <div className="md:w-[100%] w-[100%] mt-5 p-0 md:mr-[60px]">
          <div className="font-bold text-center md:grid md:grid-cols-[300px_700px] gap-6 md:ml-[15%]">
            <div className="md:h-[595px] md:w-[300px] md:bg-white md:shadow-lg">
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
            <div className="grid grid-cols-2 md:grid md:grid-cols-[auto_auto_auto] w-[100%] gap-2 md:gap-6 md:m-auto">
              {products?.map((product: IProduct) => (
                <Link
                  href={`/products/${product.slug}`}
                  key={product._id}
                  className="w-[90%] md:w-[100%] h-[90%] md:h-[100%] m-auto"
                >
                  <div className="bg-white w-[100%] md:w-[100%] h-[262px] md:h-[100%] m-auto hover:shadow-2xl shadow-lg text-left relative">
                    <img
                      src={product.image}
                      alt="products"
                      className="w-[300px] h-[180px] md:h-[200px] m-auto mt-0 mb-0"
                    />
                    <div className="flex flex-col">

                      <span className="text-[#828282] font-semibold mt-2 md:mt-2 text-[12px] ml-2">
                        {product.name}
                      </span>
                      <span className="text-[#828282] font-bold text-[16px] md:text-[15px] ml-2">
                        {product.price}$
                      </span>
                    </div>
                    <button className="absolute bottom-[90%] left-[85%] md:bottom-[92%] md:left-[90%]">

                      <BsSuitHeartFill className="text-red-500" size="1rem" />
                    </button>
                    <button className="bg-black text-[10px] text-center text-white m-auto flex items-center justify-center p-1 w-[60%] md:w-[80%] md:mb-2 mb-1 md:mt-1 mt-1">
                      <span className="md:text-[12px]">Add to cart</span>
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
  await connect();
  const products = await Product.find();
  return {
    props: {
      products: toJSON(products),
    },
  };
}
