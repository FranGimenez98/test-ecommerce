import Head from "next/head";
import React from "react";
import Navbar from "../navbar";

interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
  user?: void;
}

export default function Layout({ children, title, user }: LayoutProps) {
  return (
    <>
      <div>
        <Head>
          <title>
            {title ? title + " - Test Ecommerce" : "Test Ecommerce"}
          </title>
        </Head>
        <div className="h-screen bg-[#ebebeb]">
          <Navbar />
          <main className="w-[100%] m-auto flex flex-col items-center">
            {children}
          </main>
          <footer></footer>
        </div>
      </div>
    </>
  );
}
