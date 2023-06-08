import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

interface SignOutModalProps {
  isOpenSignOutMessage?: boolean | undefined;
  setIsOpenSignOutMessage?: (bool: boolean) => void | undefined;
}

const handleLogout = () => {
  Cookies.remove("cart");
  signOut({ callbackUrl: "/login" });
};

const SignOutModal = ({
  isOpenSignOutMessage,
  setIsOpenSignOutMessage,
}: SignOutModalProps) => {
    
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
      <div className="bg-white py-8 w-[85%] md:w-[25%] relative z-[40] flex items-center justify-center flex-col">
        <h2 className="text-xl uppercase font-medium mb-5">Log out</h2>
        <p className="text-center">Are you sure,<br/> you want to logout?</p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <button className="bg-gray-200 text-gray-500 px-4 py-1" onClick={() => {
          if (setIsOpenSignOutMessage) {
            setIsOpenSignOutMessage(false);
          }
        }}>
            Cancel
          </button>
          <button
            className="bg-red-500 px-2 py-1 text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div
        className="w-full h-full bg-black/40 flex items-center justify-center absolute"
        onClick={() => {
          if (setIsOpenSignOutMessage) {
            setIsOpenSignOutMessage(false);
          }
        }}
      />
    </div>
  );
};

export default SignOutModal;
