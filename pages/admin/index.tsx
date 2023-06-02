import { FaShoppingBag } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { MdOutlineHideImage } from "react-icons/md";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { connect } from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import ChartGeneral from "./components/chartGeneral";
import ChartProducts from "./components/chartProducts";
import Order from "@/models/Order";
import toJSON from "@/lib/toJSON";
import AdminLayout from "@/components/layouts/adminLayout";

interface ProductsProps {
  orderData: any;
  totalProducts: number;
  totalUsers: number;
  maleProducts: number;
  femaleProducts: number;
  lastFiveUsers: any;
  totalOrders: number;
  ordersByMonth: any[];
}

export default function Admin({
  orderData,
  totalProducts,
  totalUsers,
  maleProducts,
  femaleProducts,
  totalOrders,
  ordersByMonth,
}: ProductsProps) {
  return (
    <AdminLayout>
      <div>
        <div className="p-4 sm:ml-64">
          <div className="md:p-4 rounded-lg dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center justify-between p-2 md:p-0 h-24 rounded bg-gray-50 md:text-blue-400 text-white bg-[url('../assets/cool-background.svg')] bg-center md:bg-cover cursor-default">
                <div className="flex flex-col md:p-1 md:ml-3 text-center">
                  <h2 className="text-[25px] md:text-[40px]">
                    {totalProducts}
                  </h2>
                  <span className="text-[10px] md:text-[12px]">Total Products</span>
                </div>
                <div className="bg-white rounded-full h-[32px] md:h-[40px] w-[38px] md:w-[40px] relative md:mr-3">
                  <FaShoppingBag className="text-blue-500 absolute right-[16%] md:right-[7px] bottom-[19%] md:bottom-2 h-[22px] md:h-[25px] w-[22px] md:w-[25px]" />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 md:p-0 h-24 rounded bg-gray-50 dark:bg-amber-500 text-white bg-[url('../assets/cool-background.png')] bg-center bg-cover cursor-default">
                <div className="flex flex-col md:p-1 md:ml-3 text-center">
                  <h2 className="text-[25px] md:text-[40px]">{totalUsers}</h2>
                  <span className="text-[10px] md:text-[12px]">Total Clients</span>
                </div>
                <div className="bg-white rounded-full h-[32px] md:h-[40px] w-[38px] md:w-[40px] relative md:mr-3">
                  <FiUsers className="text-green-800 absolute right-[19%] md:right-[7px] bottom-[19%] md:bottom-2 h-[22px] md:h-[25px] w-[22px] md:w-[25px]" />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 md:p-0 h-24 rounded bg-gray-50 dark:bg-cyan-500 text-white bg-[url('../assets/cool-background-2.png')] bg-center bg-cover cursor-default">
                <div className="flex flex-col md:p-1 md:ml-3 text-center">
                  <h2 className="text-[25px] md:text-[40px] text-yellow-900">
                    {totalOrders}
                  </h2>
                  <span className="text-[10px] md:text-[12px] text-yellow-900">
                    Total Purchases
                  </span>
                </div>
                <div className="bg-white rounded-full h-[32px] md:h-[40px] w-[38px] md:w-[40px] relative md:mr-3">
                  <BiPurchaseTagAlt className="text-yellow-900 absolute right-[19%] md:right-[7px] bottom-[19%] md:bottom-2 h-[22px] md:h-[25px] w-[22px] md:w-[25px]" />
                </div>
              </div>
            </div>
            <div className="w-[100%] grid grid-cols-1 md:grid-cols-[1fr_330px] items-center justify-center h-85 mb-1 rounded">
              <ChartGeneral ordersByMonth={ordersByMonth} />
              <div>
                <ChartProducts
                  totalProducts={totalProducts}
                  femaleProducts={femaleProducts}
                  maleProducts={maleProducts}
                />
              </div>
            </div>
            <div className="h-full rounded p-0 md:p-3">
              <span className="text-left font-bold">Recent Orders</span>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-[100%] text-sm text-gray-500 dark:text-gray-400 text-center">
                  <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-blue-600 dark:text-white">
                    <tr>
                      <th scope="col" className="px-2 md:px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-2 md:px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-2 md:px-6 py-3">
                        Product
                      </th>
                      <th scope="col" className="px-2 md:px-6 py-3">
                        Size
                      </th>
                      <th scope="col" className="px-2 md:px-6 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-2 md:px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-2 md:px-6 py-3">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData?.map((order: any, index: any) => (
                      <tr
                        className="bg-white border-b dark:bg-white-800 text-black dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-200"
                        key={index}
                      >
                        <th
                          scope="row"
                          className="px-2 md:px-6 py-3 md:py-4 font-medium text-black whitespace-nowrap dark:text-black flex justify-center"
                        >
                          <span className="ml-2 mb-4 md:mb-0 text-blue-600">
                            {order.userName}
                          </span>
                        </th>
                        <td className="px-2 md:px-6 md:py-4">{order.userEmail}</td>
                        <td className="px-6 md:px-6 py-4 md:py-4 items-center flex flex-row">
                          {order.productImg ? (
                            <img
                              src={order.productImg}
                              alt="product"
                              className="w-[40px] h-[40px] m-0"
                            />
                          ) : (
                            <MdOutlineHideImage size="2rem" className="justify-center" />
                          )}
                          <span className="ml-2">{order.productName}</span>
                        </td>
                        <td className="px-6 md:px-6 md:py-4">{order.productSize}</td>
                        <td className="px-2 md:px-6 md:py-4">{order.dateOrder}</td>
                        <td
                          className="px-2 md:px-6 md:py-4"
                          style={{
                            color:
                              order.orderStatus === "PENDING"
                                ? "#F7CB73"
                                : "#4bb543",
                          }}
                        >
                          {order.orderStatus}
                        </td>
                        <td className="md:px-6 md:py-4">{order.productPrice}$</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  await connect();

  try {
    const users = await User.find();
    const lastFiveUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const totalUsers = users.length;

    const products = await Product.find();
    const totalProducts = products.length;
    const maleProducts = await Product.countDocuments({ sex: "Men" });
    const femaleProducts = await Product.countDocuments({ sex: "Women" });

    const orders = await Order.find();
    const totalOrders = orders.length;

    const lastFiveOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name lastname email")
      .populate("orderItems.product", "name price image")
      .lean();

    const orderData = lastFiveOrders.map((order) => ({
      orderId: order._id,
      userName: `${order.user.name.charAt(0).toUpperCase()}${order.user.name
        .slice(1)
        .toLowerCase()} ${order.user.lastname
        .charAt(0)
        .toUpperCase()}${order.user.lastname.slice(1).toLowerCase()}`,
      userEmail: order.user.email,
      productImg: order.orderItems[0]?.product?.image || "",
      productName: order.orderItems[0]?.product?.name || '',
      productPrice: order.orderItems[0]?.product?.price || '',
      productSize: order.orderItems[0]?.size || '',
      orderStatus: order.status,
      dateOrder: `${order.createdAt.getDate()}/${
        order.createdAt.getMonth() + 1
      }/${order.createdAt.getFullYear()}`,
    }));

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const ordersByMonth: {
      [key: string]: {
        month: string;
        year: number;
        pending: number;
        approved: number;
      };
    } = {};

    const allOrders = await Order.find({
      createdAt: {
        $lt: new Date(currentYear, 12, 1),
        $gte: new Date(currentYear, 1, 1),
      },
    }).lean();
    console.log(allOrders);

    allOrders.forEach((order) => {
      const month = order.createdAt.getMonth() + 1;
      const year = order.createdAt.getFullYear();
      const key = `${year}-${month}`;

      if (!ordersByMonth[key]) {
        const monthName = getMonthName(month);
        ordersByMonth[key] = {
          month: monthName,
          year,
          pending: 0,
          approved: 0,
        };
      }

      if (order.status === "PENDING") {
        ordersByMonth[key].pending++;
      } else if (order.status === "APPROVED") {
        ordersByMonth[key].approved++;
      }
    });

    function getMonthName(month: number) {
      const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      return monthNames[month - 1];
    }

    const orderedOrdersByMonth: {
      [key: string]: {
        month: string;
        year: number;
        pending: number;
        approved: number;
      };
    } = Object.keys(ordersByMonth)
      .sort((a, b) => {
        const [yearA, monthA] = a.split("-").map((value) => parseInt(value));
        const [yearB, monthB] = b.split("-").map((value) => parseInt(value));
        return yearB - yearA || monthB - monthA;
      })
      .reduce(
        (
          obj: {
            [key: string]: {
              month: string;
              year: number;
              pending: number;
              approved: number;
            };
          },
          key
        ) => {
          obj[key] = ordersByMonth[key];
          return obj;
        },
        {}
      );

    return {
      props: {
        lastFiveUsers: toJSON(lastFiveUsers as any),
        totalUsers,
        totalProducts,
        maleProducts,
        femaleProducts,
        orderData: toJSON(orderData as any),
        totalOrders,
        ordersByMonth: orderedOrdersByMonth,
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      props: {
        lastFiveUsers: 0,
        totalUsers: 0,
        totalProducts: 0,
        maleProducts: 0,
        femaleProducts: 0,
        orderData: 0,
        totalOrders: 0,
      },
    };
  }
}