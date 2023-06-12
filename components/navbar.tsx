import Link from "next/link";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaBars } from "react-icons/fa";
import { BsFillCartFill, BsSuitHeartFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import useDropdownMenu from "../hooks/useToggleMenu";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const handleLogout = () => {
  Cookies.remove("cart");
  signOut({ callbackUrl: "/login" });
};

interface NavbarProps {
  setIsOpenCart: (bool: boolean) => void;
  cartItems: number | undefined;
  isOpenSidebar: boolean;
  setIsOpenSidebar: (bool: boolean) => void;
  isOpenSignOutMessage?: boolean | undefined;
  setIsOpenSignOutMessage?: (bool: boolean) => void | undefined;
}

export default function Navbar({
  setIsOpenCart,
  cartItems,
  setIsOpenSidebar,
  setIsOpenSignOutMessage,
}: NavbarProps) {
  const { data: session, status } = useSession();

  const router = useRouter();

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
      className="bg-white top-0 sticky z-20 border-b-[1px] border-b-slate-200 navbar-sticky"
      ref={ref}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex flex-row text-[#8dc572] items-center ml-2"
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-black">👕 Bazz</h1>
          </div>

          {/* <GiClothes size="2rem" className="mr-1" />
          <div className="flex flex-col leading-3">
            <span className="text-sm">E-Commerce</span>
            <span className="text-base">Clothes Shop</span>
          </div> */}
        </Link>
        <div className="relative flex items-center md:order-2">
          <div className="flex gap-3 mr-1 md:mr-0 md:gap-8">
            <Link
              href="/favorites"
              className="flex items-center justify-center"
            >
              <button>
                <BsSuitHeartFill className="text-xl text-black" />
              </button>
            </Link>

            {session ? (
              <button
                type="button"
                className="flex items-center justify-center"
                // className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded={showMenu ? "true" : "false"}
                onClick={toggleMenu}
              >
                <span className="sr-only">Open user menu</span>
                <FaUserAlt className="text-xl" />
              </button>
            ) : (
              <button
                type="button"
                className="flex items-center justify-center"
                // className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded={showMenu ? "true" : "false"}
                onClick={() => {
                  router.push("/login");
                }}
              >
                <span className="sr-only">Open user menu</span>
                <FaUserAlt className="text-xl" />
              </button>
            )}

            <div className="relative flex items-center justify-center">
              <button onClick={() => setIsOpenCart(true)}>
                <BsFillCartFill className="text-2xl text-black" />
              </button>
              {cartItems && cartItems > 0 ? (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <span className="text-xs">{cartItems}</span>
                </div>
              ) : (
                <div className="hidden"></div>
              )}
            </div>

            <div
              className={`${
                showMenu ? "block" : "hidden"
              } absolute top-full z-50 right-0 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-md shadow-md`}
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-800">
                  {session?.user.name}
                </span>
                <span className="block text-sm  text-gray-800 truncate">
                  {session?.user.email}
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button ">
                <li>
                  <Link
                    href={`/orders/${session?.user.id}`}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 "
                  >
                    Orders
                  </Link>
                </li>
                {session?.user.isAdmin && (
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    >
                      Dashboard
                    </a>
                  </li>
                )}

                <li>
                  <button
                    onClick={() => {
                      if (setIsOpenSignOutMessage) {
                        setIsOpenSignOutMessage(true);
                      }
                    }}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 w-full text-start "
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            className="inline-flex items-center justify-center p-2 ml-1 text-xl text-black md:hidden"
            // aria-controls="mobile-menu-2"
            // aria-expanded={showMenuMobile ? "true" : "false"}
            onClick={() => setIsOpenSidebar(true)}
          >
            <span className="sr-only">Open main menu</span>
            <FaBars />
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
              <Link
                href="/"
                className="block py-2 pl-3 pr-4 text-black bg-blue-700 uppercase rounded md:bg-transparent md:p-0 md:text-black"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li className="relative">
              <button
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar"
                className="flex items-center justify-between w-full py-2 pl-3 pr-4 text-black uppercase md:text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0 md:w-auto focus:text-black dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                aria-expanded={showProducts ? "true" : "false"}
                onClick={toggleProducts}
              >
                Products <TiArrowSortedDown />
              </button>
              <div
                id="dropdownNavbar"
                className={`${
                  showProducts ? "block" : "hidden"
                } absolute z-10 font-normal bg-white divide-y divide-gray-100 rounded-md shadow-md w-44  `}
              >
                <ul
                  className="py-2 text-sm text-gray-800"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <Link
                      href="/products"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?sex=Men"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Men Clothes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?sex=Women"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Women Clothes
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <a
                href="#"
                className="block text-black md:text-black uppercase rounded"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-black md:text-black uppercase rounded"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-black md:text-black uppercase rounded"
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
