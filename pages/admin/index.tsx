import { MdDashboard, MdNotificationsActive } from "react-icons/md";
import { HiShoppingBag, HiUsers } from "react-icons/hi";
import { VscSignOut, VscSignIn } from "react-icons/vsc";
import { FaShoppingBag } from "react-icons/fa";
import { HomeProps } from "..";
import { FiUsers } from "react-icons/fi";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { connect } from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import ChartGeneral from "./components/chartGeneral";
import ChartProducts from "./components/chartProducts";

interface ProductsProps {
  totalProducts: number;
  totalUsers: number;
  maleProducts: number;
  femaleProducts: number;
}

export default function Admin({ totalProducts, totalUsers, maleProducts, femaleProducts }: ProductsProps) {
  return (
    <div>
      <button
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        aria-controls="separator-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="separator-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MdDashboard />
                <span className="ml-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MdNotificationsActive />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Notifications
                </span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  3
                </span>
              </a>
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
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiShoppingBag />
                <span className="flex-1 ml-3 whitespace-nowrap">Products</span>
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

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center justify-between h-24 rounded bg-gray-50 text-blue-400 bg-[url('../assets/cool-background.svg')] bg-center bg-cover cursor-default">
              <div className="flex flex-col p-1 ml-3">
                <h2 className="text-[40px]">{totalProducts}</h2>
                <span className="text-[12px]">Total Products</span>
                {/* <span className="text-[12px]">In your website</span> */}
              </div>
              <div className="bg-white rounded-full h-[40px] w-[40px] relative mr-3">
                <FaShoppingBag
                  className="text-blue-500 absolute right-[7px] bottom-2"
                  size="1.6rem"
                />
              </div>
            </div>
            <div className="flex items-center justify-between h-24 rounded bg-gray-50 dark:bg-amber-500 text-white bg-[url('../assets/cool-background.png')] bg-center bg-cover cursor-default">
              <div className="flex flex-col p-1 ml-3">
                <h2 className="text-[40px]">{totalUsers}</h2>
                <span className="text-[12px]">Total Clients</span>
              </div>
              <div className="bg-white rounded-full h-[40px] w-[40px] relative mr-3">
                <FiUsers
                  className="text-green-800 absolute right-[7px] bottom-2"
                  size="1.6rem"
                />
              </div>
            </div>
            <div className="flex items-center justify-between h-24 rounded bg-gray-50 dark:bg-cyan-500 text-white bg-[url('../assets/cool-background-2.png')] bg-center bg-cover cursor-default">
              <div className="flex flex-col p-1 ml-3">
                <h2 className="text-[40px] text-yellow-900">20</h2>
                <span className="text-[12px] text-yellow-900">
                  Total Purchases
                </span>
              </div>
              <div className="bg-white rounded-full h-[40px] w-[40px] relative mr-3">
                <BiPurchaseTagAlt
                  className="text-yellow-900 absolute right-[7px] bottom-2"
                  size="1.6rem"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-start p-2">
            <h3 className="text-[20px]">All stats</h3>
          </div>
          <div className="w-[100%] grid grid-cols-1 md:grid-cols-[1fr_330px] items-center justify-center h-96 mb-4 rounded border-2 border-gray-200 border-dashed">
            <ChartGeneral />
            <div>
              <ChartProducts totalProducts={totalProducts} femaleProducts={femaleProducts} maleProducts={maleProducts}/>
            </div>
          </div>
          <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
            <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  await connect();

  try {
    const users = await User.find();
    const totalUsers = users.length;

    const products = await Product.find();
    const totalProducts = products.length;
    const maleProducts = await Product.countDocuments({ sex: 'Men' });
    const femaleProducts = await Product.countDocuments({ sex: 'Women' });

    return {
      props: {
        totalUsers,
        totalProducts,
        maleProducts,
        femaleProducts
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      props: {
        totalUsers: 0,
        totalProducts: 0,
        maleProducts: 0,
        femaleProducts: 0,
      },
    };
  }
}
