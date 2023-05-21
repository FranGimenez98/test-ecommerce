import Head from "next/head";
import React from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { useSession } from "next-auth/react";
import { ICart } from "@/interfaces/ICart";
import { FaWhatsapp } from "react-icons/fa";

interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
  user?: void;
  cart?: ICart | undefined;
}

export default function Layout({ children, title, user }: LayoutProps) {
  const { data: session } = useSession();
  return (
    <>
      <div>
        <Head>
          <title>
            {title ? title + " - Test Ecommerce" : "Test Ecommerce"}
          </title>
        </Head>
        <div className="min-h-screen bg-[#ebebeb]">
          <Navbar />
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
