import React, { useEffect } from "react";
IoIosArrowBack;
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";

interface Props {
  showSort?: boolean | undefined;
  setShowSort?: (bool: boolean) => void | undefined;
  sortHandler?: (sort: string) => void | undefined;
}

const SortMobile = ({ showSort, setShowSort, sortHandler }: Props) => {
  useEffect(() => {
    // Ocultar la barra de desplazamiento y deshabilitar el scroll al montar el componente
    document.body.style.overflow = "hidden";

    // Restaurar el scroll y mostrar la barra de desplazamiento al desmontar el componente
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="fixed md:hidden top-0 w-full h-full z-20 flex items-center justify-center">
      <motion.div
        className="bg-white w-full p-4 pb-5 fixed bottom-0 z-[40] flex  flex-col md:hidden gap-3"
        initial={{ transform: "translateY(100%)" }}
        animate={{ transform: "translateY(0%)" }}
        exit={{ transform: "translateY(100%)" }}
        transition={{ duration: 0.3 }}
      >
        <div className=" flex items-center gap-2 mb-2">
          <button
            className="flex items-center justify-center"
            onClick={() => {
              if (setShowSort) {
                setShowSort(false);
              }
            }}
          >
            <IoIosArrowBack className="text-3xl" />
          </button>

          <h2 className="text-2xl font-semibold uppercase">Sort By</h2>
        </div>
        <div className="border-b-[1px] border-gray-200 pb-1">
          <button
            className="text-xl w-full text-start"
            onClick={() => {
              if (sortHandler) {
                sortHandler("newest");
              }
            }}
          >
            Newest Arrivals
          </button>
        </div>

        <div className="border-b-[1px] border-gray-200 pb-1">
          <button
            className="text-xl w-full text-start"
            onClick={() => {
              if (sortHandler) {
                sortHandler("featured");
              }
            }}
          >
            Featured
          </button>
        </div>

        <div className="border-b-[1px] border-gray-200 pb-1">
          <button
            className="text-xl w-full text-start"
            onClick={() => {
              if (sortHandler) {
                sortHandler("toprated");
              }
            }}
          >
            Top Rated
          </button>
        </div>

        <div className="border-b-[1px] border-gray-200 pb-1">
          <button
            className="text-xl w-full text-start"
            onClick={() => {
              if (sortHandler) {
                sortHandler("lowest");
              }
            }}
          >
            Price: Low to High
          </button>
        </div>

        <div className="pb-1 mb-4">
          <button
            className="text-xl w-full text-start"
            onClick={() => {
              if (sortHandler) {
                sortHandler("highest");
              }
            }}
          >
            Price: High to Low
          </button>
        </div>
      </motion.div>
      <div
        className="w-full h-full bg-black/40 flex items-center justify-center absolute"
        onClick={() => {
          if (setShowSort) {
            setShowSort(false);
          }
        }}
      ></div>
    </div>
  );
};

export default SortMobile;
