import Layout from "@/components/layouts/layout";
import Link from "next/link";
import React from "react";
import { BsCheckLg } from "react-icons/bs";

export default function SuccessPaymentScreen() {
  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] w-[95%] flex flex-col items-center justify-center">
        <div className="h-12 w-12 bg-emerald-500 rounded-full text-white flex items-center justify-center">
          <BsCheckLg className="text-4xl" />
        </div>
        <h1 className="text-emerald-500 font-semibold text-xl">
          Payment Succesful
        </h1>
        <p className="text-center">
          You will be redirected to the home page shortly or click here to
          return to home page
        </p>
        
      <Link href="/">
        
        <button className="bg-emerald-500 px-5 py-1 rounded text-white text-xl ">
          HOME
        </button>
        </Link>
      </section>
    </Layout>
  );
}
