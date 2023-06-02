import Head from "next/head";
import React, {useState} from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { useSession } from "next-auth/react";
import { ICart } from "@/interfaces/ICart";
import { FaWhatsapp } from "react-icons/fa";
import FiltersMobile from "../filtersMobile";
import { ILayoutProps } from "@/interfaces/ILayout";
import Cart from "../cart";

export default function Layout({
  children,
  title,
  user,
  categories,
  colors,
  showFilters,
  setShowFilters,
  categoryHandler,
  priceHandler,
  sexHandler,
  ratingHandler,
  colorHandler,
  
}: ILayoutProps) {
  const { data: session } = useSession();
  const [isOpenCart, setIsOpenCart] = useState(false)

  return (
    <>
      <div>
        <Head>
          <title>
            {title ? title + " - Test Ecommerce" : "Test Ecommerce"}
          </title>
        </Head>
        <div className="min-h-screen bg-white relative">
          {/* <div className="min-h-screen bg-[#ebebeb]"> */}
          <Navbar setIsOpenCart={setIsOpenCart} />
          {showFilters && (
            <FiltersMobile
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              colors={colors}
              categories={categories}
              categoryHandler={categoryHandler}
              priceHandler={priceHandler}
              sexHandler={sexHandler}
              ratingHandler={ratingHandler}
              colorHandler={colorHandler}
            />
          )}
          {isOpenCart && <Cart setIsOpenCart={setIsOpenCart} />}

          {/* <Cart cart={cart} /> */}
          <main className="w-[100%] m-auto flex flex-col items-center">
            {children}
          </main>
          <Footer></Footer>
        </div>
        {/* <div className="m-0 sticky bottom-[30px] left-[300px] md:left-[1330px] z-10 rounded-full bg-green-600 w-[50px] h-[50px]">
          <a
            className="text-white m-[0px]"
            href="https://wa.me/1125245289?text=Hola, me gustaria saber mas sobre tus servicios..."
            target="_blank"
          >
            <FaWhatsapp className="m-[0px] h-[50px] w-[50px] p-2" />
          </a>
        </div> */}
      </div>
    </>
  );
}
