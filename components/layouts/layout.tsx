import Head from "next/head";
import React, { useState, useEffect, useContext } from "react";
import { ILayoutProps } from "@/interfaces/ILayout";
import Cart from "@/components/cart";
import CartContext from "@/context/CartContext";
import dynamic from "next/dynamic";
import { CartItem } from "@/interfaces/IInitalState";
import SortMobile from "../sortMobile";

const Navbar = dynamic(
  () => import("@/components/navbar").then((ctx) => ctx.default),
  { ssr: false }
);

const Sidebar = dynamic(
  () => import("@/components/sidebar").then((ctx) => ctx.default),
  { ssr: false }
);

const Footer = dynamic(
  () => import("@/components/footer").then((ctx) => ctx.default),
  { ssr: false }
);

const FiltersMobile = dynamic(
  () => import("@/components/filtersMobile").then((ctx) => ctx.default),
  { ssr: false }
);

const NoSessionWishlist = dynamic(
  () => import("@/components/noSessionWishlist").then((ctx) => ctx.default),
  { ssr: false }
);

const SignOutModal = dynamic(
  () => import("@/components/signoutModal").then((ctx) => ctx.default),
  { ssr: false }
);

export default function Layout({
  children,
  title,
  user,
  categories,
  colors,
  showFilters,
  setShowFilters,
  showSort,
  setShowSort,
  sortHandler,
  categoryHandler,
  priceHandler,
  sexHandler,
  ratingHandler,
  colorHandler,
  isOpenWishlistMessage,
  setIsOpenWishlistMessage,
}: ILayoutProps) {
  const [cartItems, setCartItems] = useState<number>();
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isOpenSignOutMessage, setIsOpenSignOutMessage] = useState(false);
  const { state } = useContext(CartContext);

  useEffect(() => {
    setCartItems(
      (
        state?.cart?.cartItems.reduce as (
          callbackfn: (
            previousValue: number,
            currentValue: CartItem,
            currentIndex: number,
            array: CartItem[]
          ) => number,
          initialValue: number
        ) => number
      )(
        (accumulator: number, currentItem: CartItem) =>
          accumulator + currentItem.quantity,
        0
      ) ?? 0
    );
  }, [state?.cart.cartItems]);

  return (
    <>
      <div>
        <Head>
          <title>
            {title ? title + " - Bazz Ecommerce" : "Bazz Ecommerce"}
          </title>
        </Head>
        <div className="min-h-screen bg-white relative">
          {/* <div className="min-h-screen bg-[#ebebeb]"> */}
          <Navbar
            setIsOpenCart={setIsOpenCart}
            cartItems={cartItems || undefined}
            isOpenSidebar={isOpenSidebar}
            setIsOpenSidebar={setIsOpenSidebar}
            isOpenSignOutMessage={isOpenSignOutMessage}
            setIsOpenSignOutMessage={setIsOpenSignOutMessage}
          />

          {isOpenSidebar && (
            <Sidebar
              isOpenSidebar={isOpenSidebar}
              setIsOpenSidebar={setIsOpenSidebar}
            />
          )}

          {showFilters && (
            <FiltersMobile
              showFilters={showFilters}
              setShowFilters={(bool) => setShowFilters?.(bool)}
              colors={colors || []}
              categories={categories || []}
              categoryHandler={categoryHandler || (() => {})}
              priceHandler={priceHandler || (() => {})}
              sexHandler={sexHandler || (() => {})}
              ratingHandler={ratingHandler || (() => {})}
              colorHandler={colorHandler || (() => {})}
            />
          )}
          {isOpenCart && (
            <Cart
              setIsOpenCart={setIsOpenCart}
              isOpenCart={isOpenCart || undefined}
            />
          )}
          {isOpenWishlistMessage && (
            <NoSessionWishlist
              setIsOpenWishlistMessage={(bool) =>
                setIsOpenWishlistMessage && setIsOpenWishlistMessage(bool)
              }
            />
          )}
          {isOpenSignOutMessage && (
            <SignOutModal
              isOpenSignOutMessage={isOpenSignOutMessage}
              setIsOpenSignOutMessage={setIsOpenSignOutMessage}
            />
          )}
          {showSort && (
            <SortMobile
              showSort={showSort}
              setShowSort={setShowSort }
              sortHandler={sortHandler}
            />
          )}

          <main className="w-[100%] m-auto flex flex-col items-center overflow-hidden">
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
