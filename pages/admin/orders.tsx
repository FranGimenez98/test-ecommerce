import AdminLayout from "@/components/layouts/adminLayout";
import { connect } from "@/lib/db";
import toJSON from "@/lib/toJSON";
import Order from "@/models/Order";
import React from "react";
import Image from 'next/image';
import { GrDownload } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";

interface ProductsProps {
  orders: any;
}

export default function AdminOrders({ orders }: ProductsProps) {
  return (
    <AdminLayout>
      <div className="relative ml-[300px] mr-[50px] mt-[20px] h-screen overflow-x-auto shadow-md sm:rounded-lg">
        <span className="text-left text-black">Orders List</span>
        <table className="w-[100%] text-sm text-gray-500 dark:text-gray-400 text-center">
          <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-blue-600 dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3">
                Size
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Total Price
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any, index: any) => (
              <tr
                className="bg-white border-b dark:bg-white-800 text-black dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-200"
                key={index}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black flex"
                >
                  <span className="ml-2 text-blue-600">{order.userName}</span>
                </th>
                <td className="px-6 py-4">{order.userEmail}</td>
                <td className="px-6 py-4 items-center flex flex-row">
                  {order.productImg ? (
                    <img
                      src={order.productImg}
                      alt="product"
                      className="w-[40px] h-[40px] m-0"
                    />
                  ) : (
                    <Image
                      src="/test-ecommerce/assets/icon-not-found.png"
                      alt="not found"
                      width={30}
                      height={30}
                      className="w-[30px] h-[30px] m-0"
                    />
                  )}
                  <span className="ml-2">{order.productName}</span>
                </td>
                <td className="px-6 py-4">{order.productSize}</td>
                <td className="px-6 py-4">{order.dateOrder}</td>
                <td className="px-6 py-4">{order.productPrice}$</td>
                <td className="px-6 py-4">{order.orderStatus}</td>
                <td className="px-6 py-4 text-right flex flex-row justify-between">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <GrDownload size="1.2rem" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  await connect();

  try {
    // const color = await Color.find();
    // const category = await Category.find();

    const orderData = await Order.find()
      .populate("user", "name lastname email")
      .populate("orderItems.product", "name price image")
      .lean();

    const orders = orderData.map((order) => ({
      orderId: order._id,
      userName: `${order.user.name.charAt(0).toUpperCase()}${order.user.name
        .slice(1)
        .toLowerCase()} ${order.user.lastname
        .charAt(0)
        .toUpperCase()}${order.user.lastname.slice(1).toLowerCase()}`,
      userEmail: order.user.email,
      productImg: order.orderItems[0].product.image,
      productName: order.orderItems[0].product.name,
      productPrice: order.orderItems[0].product.price,
      productSize: order.orderItems[0].size,
      orderStatus: order.status,
      dateOrder: `${order.createdAt.getDate()}/${
        order.createdAt.getMonth() + 1
      }/${order.createdAt.getFullYear()}`,
    }));

    return {
      props: {
        orders: toJSON(orders as any),
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      props: {
        orders: [],
      },
    };
  }
}
