import { ICategory } from "@/interfaces/ICategory";
import { IColor } from "@/interfaces/IColor";
import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";

interface FilterProps {
  showFilters: boolean;
  setShowFilters: (bool: boolean) => void | undefined;
  categoryHandler: (category: string) => void | undefined;
  priceHandler: (price: string) => void | undefined;
  sexHandler: (sex: string) => void | undefined;
  ratingHandler: (rating: number) => void | undefined;
  colorHandler: (color: string) => void | undefined;
  colors: IColor[];
  categories: ICategory[];
}

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];

const sexCategories = ["Men", "Women"];

const FiltersMobile = ({
  setShowFilters,
  colors,
  categories,
  categoryHandler,
  priceHandler,
  sexHandler,
  ratingHandler,
  colorHandler,
}: FilterProps) => {
  const [openCategories, setOpenCategories] = useState(false);
  const [openPrices, setOpenPrices] = useState(false);
  const [activeSex, setActiveSex] = useState("");
  const [ratingStar, setRatingStar] = useState<number | null>(null);

  const printSexButton = (sex: string) => {
    if (sex === activeSex) {
      setActiveSex(""); // Eliminar filtro
    } else {
      setActiveSex(sex);
    }
  };

  const printRatingStars = (rating: number) => {
    if (rating === ratingStar) {
      setRatingStar(0);
    } else {
      setRatingStar(rating);
    }
  };

  useEffect(() => {
    // Ocultar la barra de desplazamiento y deshabilitar el scroll al montar el componente
    document.body.style.overflow = "hidden";

    // Restaurar el scroll y mostrar la barra de desplazamiento al desmontar el componente
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed top-0 w-full h-screen bg-black/30 z-30 md:hidden transition-opacity duration-500">
      <div
        className="w-full h-full bg-black/30"
        onClick={() => setShowFilters(false)}
      />

      <motion.div
        className="absolute w-[80%] h-full bg-white top-0 right-0 z-50 shadow-2xl transition-transform duration-500"
        initial={{ transform: "translateX(100%)" }}
        animate={{ transform: "translateX(0%)" }}
        exit={{ transform: "translateX(100%)" }}
        transition={{ duration: 0.3 }}
      >
        <button
          className="absolute top-3 left-3 text-sm cursor-pointer"
          onClick={() => setShowFilters(false)}
        >
          <ImCross  />
        </button>

        <div
          className="flex flex-col px-4 max-h-[20rem] mt-[4rem]"
          onClick={() => setShowFilters(true)}
        >
          <div className="my-3">
            <div className="w-full border-[1px] border-slate-200 px-1 py-1">
              <button
                className="w-full flex justify-between items-center"
                onClick={() => {
                  openCategories
                    ? setOpenCategories(false)
                    : setOpenCategories(true);
                }}
              >
                <span className="uppercase font-semibold pl-1">Categories</span>
                {openCategories ? (
                  <span className="text-black text-xl font-semibold cursor-pointer">
                    {" "}
                    <IoIosArrowForward />
                  </span>
                ) : (
                  <span className="text-black text-xl font-semibold cursor-pointer">
                    <IoIosArrowDown />
                  </span>
                )}
              </button>
              <AnimatePresence>
                {openCategories && (
                  <motion.div
                    className="py-1 flex flex-col items-start"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.1 }}
                    style={{ overflow: "hidden" }}
                    key="categories"
                  >
                    <button
                      value="all"
                      onClick={() => categoryHandler("all")}
                      className="uppercase pl-1 text-sm w-full text-start hover:bg-slate-100"
                    >
                      All
                    </button>
                    {categories &&
                      categories.map((category) => (
                        <button
                          key={category._id}
                          className="uppercase pl-1 text-sm w-full text-start hover:bg-slate-100"
                          onClick={() => categoryHandler(category.name)}
                        >
                          {category.name}
                        </button>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* menu */}
          <div className="mb-3">
            <div className="mb-3">
              <div className="w-full border-[1px] border-slate-200 px-1 py-1">
                <button
                  className="w-full flex justify-between items-center"
                  onClick={() => {
                    openPrices ? setOpenPrices(false) : setOpenPrices(true);
                  }}
                >
                  <span className="uppercase font-semibold pl-1">Prices</span>
                  {openPrices ? (
                    <span className="text-black text-xl font-semibold cursor-pointer">
                      <IoIosArrowForward />
                    </span>
                  ) : (
                    <span className="text-black text-xl font-semibold cursor-pointer">
                      <IoIosArrowDown />
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {openPrices && (
                    <motion.div
                      className="py-1 flex flex-col items-start"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.1 }}
                      style={{ overflow: "hidden" }}
                      key="categories"
                    >
                      <button
                        value="all"
                        onClick={() => priceHandler("all")}
                        className="uppercase pl-1 text-sm w-full text-start hover:bg-slate-100"
                      >
                        All
                      </button>
                      {prices &&
                        prices.map((price) => (
                          <button
                            key={price.value}
                            className="uppercase pl-1 text-sm w-full text-start hover:bg-slate-100"
                            onClick={() => priceHandler(price.value)}
                          >
                            {price.name}
                          </button>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h2 className="uppercase font-semibold text-xl">Colors</h2>
            <div className="grid grid-cols-7 w-[90%] gap-1">
              <button
                className="h-7 w-7 border-[1px] border-slate-200 cursor-pointer text-center text-red"
                onClick={() => {
                  colorHandler("all");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {colors &&
                colors.map((color) => (
                  <button
                    key={color.name}
                    style={{ backgroundColor: color.color }}
                    className={`h-7 w-7  border-[1px] border-slate-200 cursor-pointer`}
                    value={color.name}
                    onClick={() => {
                      colorHandler(color.name);
                    }}
                  ></button>
                ))}
            </div>
          </div>

          <div className="mb-3 flex flex-col">
            <h2 className="uppercase font-semibold text-xl">Sex</h2>
            <div className="w-full flex gap-2">
              {sexCategories &&
                sexCategories.map((value, index) => (
                  <button
                    key={index}
                    className={`uppercase text-lg border-[1px] border-slate-200 px-3 ${
                      activeSex === value ? "active" : ""
                    }`}
                    style={{
                      backgroundColor: activeSex === value ? "black" : "white",
                      color: activeSex === value ? "white" : "black",
                    }}
                    onClick={() => {
                      {
                        sexHandler(value), printSexButton(value);
                      }
                    }}
                  >
                    {value}
                  </button>
                ))}
            </div>
          </div>

          <div className="mb-3">
            <h2 className="uppercase font-semibold text-xl">Ratings</h2>
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={`text-${
                  ratingStar !== null && ratingStar >= value ? "yellow" : "gray"
                }-400 cursor-pointer text-[2rem]`}
                onClick={() => {
                  ratingHandler(value), printRatingStars(value);
                }}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FiltersMobile;
