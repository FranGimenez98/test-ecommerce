import Head from "next/head";
import React from "react";
import Navbar from "../navbar";
import { useSession } from "next-auth/react";
import { ICart } from "@/interfaces/ICart";

interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
  user?: void;
  cart?: ICart | undefined ;
}



export default function Layout({ children, title, user }: LayoutProps) {

  const {data: session} = useSession();

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
          <footer></footer>
        </div>
      </div>
    </>
  );
}
