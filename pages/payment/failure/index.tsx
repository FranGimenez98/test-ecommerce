import Layout from "@/components/layouts/layout";
import Link from "next/link";
import React from "react";
import { BsCheckLg } from "react-icons/bs";
import { ImCross } from "react-icons/im";

export default function SuccessPaymentScreen() {
  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] w-[95%] flex flex-col items-center pt-36 md:pt-28">
        <div className="h-20 w-20 bg-red-500 rounded-full text-white flex items-center justify-center mb-5">
          <ImCross className="text-5xl" />
        </div>
        <h1 className="text-red-500 font-semibold text-3xl uppercase">
          Payment error
        </h1>
        <div className="md:w-[30%] mb-3">
          <p className="text-center text-gray-600">
            Look like we can&apos;t confirm payment at this thime, please check your
            card details. You will be redirected to the home page shortly or
            click here to return to home page
          </p>
        </div>

        <Link href="/">
          <button className="bg-red-500 px-5 py-1 rounded text-white text-xl ">
            HOME
          </button>
        </Link>
      </section>
    </Layout>
  );
}
