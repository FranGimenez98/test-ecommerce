import Layout from "@/components/layouts/layout";
import { IUser } from "@/interfaces/IUser";
import { connect } from "@/lib/db";
import toJSON from "@/lib/toJSON";
import Order from "@/models/Order";
import User from "@/models/User";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React from "react";

interface UserProps {
  user: IUser;
  orders: any;
}

export default function UserScreen({ user, orders }: UserProps) {

  return (
    <Layout title="Profile">
      <section className="w-[97%] md:w-[90%] min-h-[calc(100vh-4rem)] flex flex-col items-center mt-4">
        <div className="w-full">
          <h2 className="font-semibold text-xl uppercase mb-1 mt-5">
            Your Orders
          </h2>
          <div className="w-full">
            {orders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {orders &&
                  orders.map((order: any) => (
                    <div
                      key={order._id}
                      className="bg-white shadow-md rounded p-2 min-h-[10rem] flex flex-col justify-between"
                    >
                      {order.orderItems.map((item: any, index: number) => (
                        <div key={index} className="flex gap-4 mb-1">
                          {/* <div>
                          <img className="h-[10rem]" src={item.image} />
                        </div> */}
                          <div className="flex flex-col">
                            <span className="uppercase font-semibold text-sm">
                              {item.name}
                            </span>
                            <span className="uppercase text-sm">
                              Size: {item.size}
                            </span>
                            <span className="uppercase text-sm ">
                              Quantity: {item.quantity}
                            </span>
                            <span className="uppercase text-sm ">
                              Price: ${item.price}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="flex flex-col gap-1 mt-6">
                        <span className="uppercase text-base font-semibold">
                          Status:{" "}
                          <span
                            className={`${
                              order.status === "APPROVED"
                                ? "text-green-500"
                                : "text-gray-500"
                            } font-semibold`}
                          >
                            {order.status}
                          </span>
                        </span>
                        <span className="uppercase text-base font-semibold">
                          Total Price: ${order.totalPrice}
                        </span>
                        {order.status !== "APPROVED" && (
                          <Link href="/placeorder">
                            <button className="bg-black text-white uppercase px-2 py-1 text-sm mt-2 w-full">
                              finish your purchase
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="w-full">
                <p>You have no orders yet, go buy somenthing!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<{ id: string }>
) {
  const { id } = ctx.params!;

  await connect();
  const [user, orders] = await Promise.all([
    User.findById(id).lean(),
    Order.find({ user: id }),
  ]);

  return {
    props: {
      user: toJSON(user as IUser),
      orders: orders ? toJSON(orders) : null,
    },
  };
}
