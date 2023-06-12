import { IProduct } from "@/interfaces/IProduct";
import Product from "@/models/Product";
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";

interface ModalEditProductProps {
  product: IProduct;
}

export default function ModalEditProduct({ product }: ModalEditProductProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  // console.log(product);

  return (
    <div className="relative">
      <FiEdit
        size="1.2rem"
        className="text-blue-600 absolute top-0 right-0 cursor-pointer"
        onClick={openModal}
      />

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="modal bg-gray-400 rounded-lg p-6 w-[600px] h-[400px] text-center text-black">
            {/* Contenido del modal */}
            <h2>Editando producto: {product._id}</h2>
            <label>
              <p>Nombre: {product.name}</p>
              <input type="text" placeholder="Product name..." />
            </label>
            <label>
              <p>Price: {product.price}</p>
              <input type="text" placeholder="Price..." />
            </label>
            {/* <label>
                <p>Nombre: {product.category}</p>
                <input type="text" placeholder="Product name..."/>
            </label> */}
            {/* <label>
                <p>Nombre: {product.sizes.map(r => (
                    r.size
                ))}</p>
                <input type="text" placeholder="Product name..."/>
            </label> */}
            {/* <label>
                <p>Nombre: {product.image}</p>
                <input type="text" placeholder="Product name..."/>
            </label>
            <label>
                <p>Nombre: {product.description}</p>
                <input type="text" placeholder="Product name..."/>
            </label> */}
            {/* <label>
                <p>Nombre: {product.sex}</p>
                <input type="text" placeholder="Product name..."/>
            </label> */}
            {/* <label>
                <p>Nombre: {product.stock}</p>
                <input type="text" placeholder="Product name..."/>
            </label> */}
            <button onClick={closeModal} className="text-white">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
