import Link from "next/link";
import React, { useEffect } from "react";
import { ImCross } from "react-icons/im";

interface Props {
  setIsOpenWishlistMessage: (bool: boolean) => void | undefined;
}

const NoSessionWishlist = ({ setIsOpenWishlistMessage }: Props) => {
  useEffect(() => {
    // Ocultar la barra de desplazamiento y deshabilitar el scroll al montar el componente
    document.body.style.overflow = "hidden";

    // Restaurar el scroll y mostrar la barra de desplazamiento al desmontar el componente
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed top-0 w-full h-full z-20 flex items-center justify-center">
      <div className="bg-white py-5 w-[85%] md:w-[40%] relative z-[40]">
        <button
          className="absolute top-3 right-3 text-sm cursor-pointer"
          onClick={() => {
            if (setIsOpenWishlistMessage) {
              setIsOpenWishlistMessage(false);
            }
          }}
        >
          <ImCross />
        </button>

        <div className="w-full h-[18rem] flex flex-col items-center justify-center">
          <h2 className="font-semibold mb-2">🔒 SAVE TO WISHLIST</h2>
          <div className="w-[80%] text-center">
            <p className="text-gray-600 text-sm">
              Login or create an account to view to your wishlist. We&apos;ll drop
              you back at your wishlist after you have entered your details.
            </p>
          </div>
          <div className="w-[50%] md:w-[35%] flex flex-col gap-2 mt-[2rem]">
            <Link href="/login" className="w-full">
              <button className="bg-gray-200 px-4 py-1 uppercase text-black font-semibold w-full">
                Login
              </button>
            </Link>
            <Link href="/signup" className="w-full">
              <button className="bg-black px-4 py-1 uppercase text-white font-semibold w-full">
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div
        className="w-full h-full bg-black/40 flex items-center justify-center absolute"
        onClick={() => {
          if (setIsOpenWishlistMessage) {
            setIsOpenWishlistMessage(false);
          }
        }}
      ></div>
    </div>
  );
};

export default NoSessionWishlist;
