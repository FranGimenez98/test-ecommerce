import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { motion } from "framer-motion";
import Link from "next/link";
import { TiArrowSortedDown } from "react-icons/ti";

interface SidebarProps {
  isOpenSidebar: boolean;
  setIsOpenSidebar: (bool: boolean) => void;
}

export default function Sidebar({
  isOpenSidebar,
  setIsOpenSidebar,
}: SidebarProps) {
  useEffect(() => {
    // Ocultar la barra de desplazamiento y deshabilitar el scroll al montar el componente
    document.body.style.overflow = "hidden";

    // Restaurar el scroll y mostrar la barra de desplazamiento al desmontar el componente
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <div className="fixed md:hidden top-0 w-full h-full z-20 flex items-center justify-center">
      <motion.div
        className={`fixed top-0 right-0 bg-white w-[90%] h-full z-20 `}
        initial={{ transform: "translateX(100%)" }}
        animate={
          isOpenSidebar
            ? { transform: "translateX(0%)" }
            : { transform: "translateX(100%)" }
        }
        exit={{ transform: "translateX(100%)" }}
        transition={{ duration: 0.3 }}
      >
        <button
          className="absolute top-3 left-3 text-sm cursor-pointer"
          onClick={() => setIsOpenSidebar(false)}
        >
          <ImCross />
        </button>

        <div className="w-full flex flex-col justify-center items-center mt-[4rem] gap-2">
          <Link href="/" className="font-medium">
            HOME
          </Link>
          <button
            className="flex gap-1 items-center justify-center"
            onClick={() => {
              isOpenMenu ? setIsOpenMenu(false) : setIsOpenMenu(true);
            }}
          >
            <span className="font-medium">PRODUCTS</span>
            <TiArrowSortedDown />
          </button>
          {isOpenMenu && (
            <div className="flex flex-col items-center gap-2 w-full mb-1">
              <Link href="/products">
                <button onClick={() => setIsOpenSidebar(false)}>
                  All products
                </button>
              </Link>
              <Link href="/products?sex=Women">
                <button onClick={() => setIsOpenSidebar(false)}>
                  Women products
                </button>
              </Link>
              <Link href="/products?sex=Men">
                <button onClick={() => setIsOpenSidebar(false)}>
                  Men products
                </button>
              </Link>
            </div>
          )}
          <Link href="/" className="font-medium">
            SERVICES
          </Link>
          <Link href="/" className="font-medium">
            ABOUT
          </Link>
          <Link href="/" className="font-medium">
            CONTACT
          </Link>
        </div>
      </motion.div>
      <div className="w-full h-full bg-black/40 flex items-center justify-center absolute" />
    </div>
  );
}
