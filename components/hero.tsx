import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div className="bg-black w-full h-[calc(100vh-7rem)] md:h-[calc<(100vh-4rem)]  bg-cover bg-no-repeat bg-center bg-origin-padding flex justify-center relative">
      <div className="w-full flex items-center flex-col z-10">
        <div className="flex flex-col justify-center">
          <motion.h2
            className="text-white text-2xl mt-[7rem]"
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", delay: 0.3, bounce: 0.2 }}
          >
            dress up with
          </motion.h2>
          <motion.h2
            className="text-white font-bold text-9xl"
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", delay: 0.6, bounce: 0.2 }}
          >
            Bazz
          </motion.h2>
        </div>
        <motion.div
          className="md:w-[35%] w-[90%]"
          initial={{ y: "-100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", delay: 1, bounce: 0.2 }}
        >
          <p className="text-white text-center text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            eget varius nibh. In scelerisque diam ut ipsum sollicitudin, ut
            efficitur felis laoreet.
          </p>
        </motion.div>

        <div className="w-[70%] md:w-[22%] mt-[1.5rem] flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-center w-full gap-2">
            <Link href="/products?sex=Women" className="w-full">
              <motion.button
                className="border-[1px] border-white text-white py-1 text-sm  font-semibold  w-full"
                initial={{ y: "-100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", delay: 1.2, bounce: 0.2 }}
              >
                SHOP WOMEN
              </motion.button>
            </Link>

            <Link href="/products?sex=Men" className="w-full">
              <motion.button
                className="border-[1px] border-white text-white py-1 text-sm  font-semibold w-full"
                initial={{ y: "-100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", delay: 1.4, bounce: 0.2 }}
              >
                SHOP MEN
              </motion.button>
            </Link>
          </div>
          <div className="justify-center m-auto items-center md:mt-[10px] mt-[10px] w-full">
            <Link href="/products" className="w-full">
              <motion.button
                className="border-[1px] border-white text-white py-1 text-sm  font-semibold w-full"
                initial={{ y: "-100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", delay: 1.6, bounce: 0.2 }}
              >
                VIEW ALL PRODUCTS
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
      <motion.div
        className="md:hidden h-[17.5rem] w-[17.5rem] rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 blur-xl absolute top-10 right-48  lg:top-14 lg:left-80"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
        viewport={{ once: true }}
      />
      <motion.div
        className="md:hidden h-[8.8rem] w-[8.8rem] rounded-full bg-gradient-to-bl from-slate-500 via-blue-500 to-cyan-200 blur-xl absolute top-80 left-64 lg:top-[16.2rem] lg:right-96"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
        viewport={{ once: true }}
      />
      <motion.div
        className="hidden md:block lg:h-[17.5rem] lg:w-[17.5rem] rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 blur-xl absolute top-14 left-80"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
        viewport={{ once: true }}
      />
      <motion.div
        className="hidden md:block lg:h-[8.8rem] lg:w-[8.8rem] rounded-full bg-gradient-to-bl from-slate-500 via-blue-500 to-cyan-200 blur-xl absolute top-[16.2rem] right-96"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
        viewport={{ once: true }}
      />
    </motion.div>
  );
}
