import React, { useState } from "react";
import AdminLayout from "@/components/layouts/adminLayout";
import Category from "@/models/Category";
import { ICategory } from "@/interfaces/ICategory";
import { NextApiRequest } from "next";
import { BiAddToQueue } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { connect } from "@/lib/db";
import toJSON from "@/lib/toJSON";

interface ProductsProps {
  categories: ICategory[];
}

export default function Categories(props: ProductsProps): React.ReactElement {
  const { categories } = props;
  return (
    <AdminLayout>
      <div className="relative ml-[300px] mr-[50px] mt-[20px] h-screen shadow-md sm:rounded-lg">
        <div className="flex flex-col mt-2">
          <div className="flex flex-row items-center">
            <MdCategory size="1.5rem" />
            <h2 className="text-left text-black ml-1 text-lg font-semibold">
              Categories
            </h2>
          </div>
          <div className="h-[35px] text-center flex justify-end w-full">
            <button>
              <BiAddToQueue size="2rem" className="text-blue-600" />
            </button>
          </div>
          <div className="mt-2">
            <table className="w-[100%] text-sm text-gray-500 dark:text-gray-400 text-center">
              <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-black dark:text-white">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name categories
                  </th>
                </tr>
              </thead>
              <tbody className="items-center">
                {categories.map((category: ICategory, index: any) => (
                <tr
                  className="bg-white border-b dark:bg-white-800 text-black dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-200"
                  key={category._id}
                >
                  <td className="px-6 py-4">{category.name}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps({
  query,
  req,
}: {
  query: NextApiRequest["query"];
  req: NextApiRequest;
}) {
  const page = parseInt(query.page as string, 10) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const filter: any = {};
  const searchQuery = (query.query as string) || "";
  const category = (query.category as string) || "";

  await connect();

  const [categories] = await Promise.all([
    Category.find().select("name").lean(),
  ]);

  return {
    props: {
      categories: toJSON(categories as any),
    },
  };
}
