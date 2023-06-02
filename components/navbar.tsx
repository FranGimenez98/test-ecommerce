import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GiClothes } from "react-icons/gi";
import { TiArrowSortedDown, TiThMenuOutline } from "react-icons/ti";
import { BsFillCartFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import useDropdownMenu from "../hooks/useToggleMenu";

// interface MyComponentProps {
//   session: {
//     expires: string;
//     user: {
//       email: string;
//       id: string;
//       isAdmin: boolean;
//       name: string;
//     };
//   };
// }

interface NavbarProps {
  setIsOpenCart: (bool: boolean) => void;
}

export default function Navbar({ setIsOpenCart }: NavbarProps) {
  const { data: session, status } = useSession();

  const {
    showMenu,
    showProducts,
    showMenuMobile,
    toggleMenu,
    toggleProducts,
    toggleMenuMobile,
    ref,
  } = useDropdownMenu<HTMLDivElement>(false);

  return (
    <nav
      className="bg-white top-0 sticky z-20 border-[1px] border-b-slate-200"
      ref={ref}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex flex-row text-[#8dc572] items-center ml-2"
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-black">Bazz</h1>
          </div>

          {/* <GiClothes size="2rem" className="mr-1" />
          <div className="flex flex-col leading-3">
            <span className="text-sm">E-Commerce</span>
            <span className="text-base">Clothes Shop</span>
          </div> */}
        </Link>
        <div className="relative flex items-center md:order-2">
          {session ? (
            <div>
              <button
                type="button"
                className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded={showMenu ? "true" : "false"}
                onClick={toggleMenu}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-green-400"
                  src="https://static.wikia.nocookie.net/memes-pedia/images/2/2d/A%C3%B1a%C3%B1in.jpg/revision/latest?cb=20200818162720&path-prefix=es"
                  alt="user photo"
                />
              </button>
              <div
                className={`${
                  showMenu ? "block" : "hidden"
                } absolute top-full z-50 right-0 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {session.user.name}
                  </span>
                  <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                    {session.user.email}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </li>
                  <li>
                    <BsFillCartFill
                      className="text-2xl text-black"
                      onClick={() => setIsOpenCart(true)}
                    />
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-white text-sm md:text-base flex justify-between mr-2 items-center">
              <Link
                href="/login"
                className="mr-1 hover:text-green-400 font-bold"
              >
                Login
              </Link>
              <span className="text-sm cursor-default">or</span>
              <Link
                href="/signup"
                className="ml-1 hover:text-green-400 font-bold"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mobile-menu-2"
            aria-expanded={showMenuMobile ? "true" : "false"}
            onClick={toggleMenuMobile}
          >
            <span className="sr-only">Open main menu</span>
            <TiThMenuOutline />
          </button>
        </div>
        <div
          className={`${
            showMenuMobile ? "block" : "hidden"
          } top-full z-50 right-0 items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="mobile-menu-2"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white ">
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-green-400 dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li className="relative">
              <button
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar"
                className="flex items-center justify-between w-full py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-[#8dc572] dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                aria-expanded={showProducts ? "true" : "false"}
                onClick={toggleProducts}
              >
                Products <TiArrowSortedDown />
              </button>
              <div
                id="dropdownNavbar"
                className={`${
                  showProducts ? "block" : "hidden"
                } absolute z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-400"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <Link
                      href="/products"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      All Products
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Men Clothes
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Women Clothes
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-[#8dc572] dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-[#8dc572] dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-[#8dc572] dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
{
  /* // <div className="w-full h-16 bg-black flex justify-between">
    //   <div className="w-[100%] md:w-[95vw] md:m-auto m-0 flex items-center justify-between">
    //     <div className="flex items-center justify-center text-white">
    //       <Link
    //         href="/"
    //         className="flex flex-row text-[#8dc572] items-center ml-2"
    //       >
    //         <GiClothes size="2rem" className="mr-1" />
    //         <div className="flex flex-col leading-3">
    //           <span className="text-sm">E-Commerce</span>
    //           <span className="text-base">Clothes Shop</span>
    //         </div>
    //       </Link>
    //     </div>
    //     <div className="flex items-center justify-center">
    //       {session ? (
    //         <div>{session?.user?.name}</div>
    //       ) : (
    //         <ul className="flex items-center gap-5 text-white">
    //           <Link href="/products">
    //             <li>Products</li>
    //           </Link>
    //           <li>LINK</li>
    //           <li>Cart</li>
    //           <li>User</li>
    //         </ul>
    //       )}
    //     </div>
    //   </div>
    // </div> */
}
