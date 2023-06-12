import React from "react";
import {
  MdCategory,
  MdColorLens,
  MdDashboard,
  MdNotificationsActive,
} from "react-icons/md";
import useDropdownMenu from "../../hooks/useToggleMenu";
import { HiShoppingBag, HiUsers } from "react-icons/hi";
import { VscSignOut, VscSignIn } from "react-icons/vsc";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { BiMenuAltLeft } from "react-icons/bi";
import { GiClothes } from "react-icons/gi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const {
    showMenu,
    showProducts,
    showMenuMobile,
    toggleMenu,
    toggleProducts,
    toggleMenuMobile,
    ref,
  } = useDropdownMenu(false);

  return (
    <div>
      <button
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        aria-controls="separator-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={toggleMenuMobile}
      >
        <span className="sr-only">Open sidebar</span>
        <BiMenuAltLeft size="1.5rem" />
      </button>

      <aside
        id="separator-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          showMenuMobile ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
        ref={ref}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-black">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/admin"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MdDashboard />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                aria-controls="dropdown-example"
                data-collapse-toggle="dropdown-example"
                onClick={toggleMenu}
              >
                <HiShoppingBag />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">
                  Products
                </span>
                {showMenu ? (
                  <span className="text-white text-xl font-semibold cursor-pointer px-2">
                    <IoIosArrowDown className="text-white" />
                  </span>
                ) : (
                  <span className="text-white text-xl font-semibold cursor-pointer px-2">
                    <IoIosArrowForward className="text-white" />
                  </span>
                )}
              </button>
              <ul
                id="dropdown-example"
                className={showMenu ? "block" : "hidden py-2 space-y-2"}
              >
                <li>
                  <Link
                    href="/admin/product"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <GiClothes />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      All products
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/categories"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MdCategory />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Categories
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/colors"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MdColorLens />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Colors
                    </span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaShoppingCart />
                <span className="flex-1 ml-3 whitespace-nowrap">Order</span>
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiUsers />
                <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
              </a>
            </li>
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <VscSignIn />
                <span className="flex-1 ml-3 whitespace-nowrap">Sign In</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <VscSignOut />
                <span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
      <main className="w-[100%]">{children}</main>
    </div>
  );
}
