import ModalEditProduct from "@/components/ModalEditProduct";
import AdminLayout from "@/components/layouts/adminLayout";
import { connect } from "@/lib/db";
import toJSON from "@/lib/toJSON";
import Category from "@/models/Category";
import Color from "@/models/Color";
import Product from "@/models/Product";
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

interface ProductsProps {
  products: any;
}

export default function AdminProducts({ products }: ProductsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    // Implementa la lógica para borrar el producto aquí
    setShowDeleteModal(false);
  };

  const handleModalClick = (e: any) => {
    // Si se hace clic en el contenedor del modal, no se cierra el modal
    e.stopPropagation();
  };

  const handleOutsideClick = () => {
    setShowDeleteModal(false);
  };

  return (
    <AdminLayout>
      <div className="relative ml-[300px] mr-[50px] mt-[20px] h-screen overflow-x-auto shadow-md sm:rounded-lg">
        <span className="text-left text-black">Products List</span>
        <table className="w-[100%] text-sm text-gray-500 dark:text-gray-400 text-center">
          <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-blue-600 dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Color
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Sex
              </th>
              <th scope="col" className="px-6 py-3">
                Stock
              </th>
              <th scope="col" className="px-6 py-3">
                Prices
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod: any, index: any) => (
              <tr
                className="bg-white border-b dark:bg-white-800 text-black dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-200"
                key={index}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black flex"
                >
                  <img
                    src={prod.image}
                    alt="product"
                    className="w-[50px] h-[50px]"
                  />
                  <span className="ml-2 text-blue-600">{prod.name}</span>
                  <span className="ml-2 text-blue-600">{prod.sizes.size}</span>
                </th>
                <td className="px-6 py-4">{prod.color.name}</td>
                <td className="px-6 py-4">{prod.category.name}</td>
                <td className="px-6 py-4">{prod.sex}</td>
                <td className="px-6 py-4">{prod.stock}</td>
                <td className="px-6 py-4">{prod.price}$</td>
                <td className="px-6 py-4 text-right flex flex-row justify-between">
                  <ModalEditProduct product={prod} />
                  <MdDeleteForever
                    size="1.2rem"
                    className="text-red-600 cursor-pointer"
                    onClick={handleDeleteClick}
                  />
                  {showDeleteModal && (
                    <div
                      className="fixed inset-0 flex items-center justify-center z-10 bg-gray-200 bg-opacity-10"
                      onClick={handleOutsideClick}
                    >
                      <div
                        className="bg-white rounded-lg p-8 shadow-sm text-center"
                        onClick={handleModalClick}
                      >
                        <h2 className="text-xl font-bold mb-4">
                          Confirmar eliminación
                        </h2>
                        <p className="text-gray-700 mb-4">
                          ¿Estás seguro de que deseas eliminar el producto?
                        </p>
                        <div className="flex justify-center">
                          <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                            onClick={handleCancelDelete}
                          >
                            Cancelar
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            onClick={handleConfirmDelete}
                          >
                            Aceptar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
    const color = await Color.find();
    const category = await Category.find();

    const products = await Product.find()
      .populate("color", "name")
      .populate("sizes", "size")
      .populate("category", "name");
    console.log(products);
    return {
      props: {
        products: toJSON(products as any),
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      props: {
        products: [],
      },
    };
  }
}
