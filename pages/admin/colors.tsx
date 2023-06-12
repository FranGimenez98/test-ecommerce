import ColorPicker from "@/components/ColorPicker";
import AdminLayout from "@/components/layouts/adminLayout";
import EditColorPicker from "@/components/EditColorPicker";
import { IColor } from "@/interfaces/IColor";
import toJSON from "@/lib/toJSON";
import Color from "@/models/Color";
import { useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { MdColorLens, MdDeleteForever } from "react-icons/md";
import { connect } from "@/lib/db";
import { NextApiRequest } from "next";
import { ImCross } from "react-icons/im";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi";

interface ProductsProps {
  colors: IColor[];
}

export default function Colors(props: ProductsProps): React.ReactElement {
  const { colors } = props;
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState<IColor | null>(null);
  const [editColorName, setEditColorName] = useState("");
  const [editColorValue, setEditColorValue] = useState("");
  const router = useRouter();

  const handleClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDeleteClick = (colorId: string) => {
    setSelectedColorId(colorId);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleModalClick = (e: any) => {
    e.stopPropagation();
  };

  const handleOutsideClick = () => {
    setShowDeleteModal(false);
  };

  const handleColorSave = () => {
    setShowModal(false);
  };

  // const handleEditColor = (color: IColor) => {
  //   setSelectedColor(color);
  //   setEditColorName(color.name);
  //   setEditColorValue(color.color);
  //   setShowEditModal(true);
  // };

  const handleEditColorNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditColorName(e.target.value);
  };

  const handleEditColorValueChange = (color: string) => {
    setEditColorValue(color);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setSelectedColor(null);
    setEditColorName("");
    setEditColorValue("");
  };

  const handleEditColorChange = (newColor: string) => {
    setEditColorValue(newColor);
  };

  const handleSaveEdit = async () => {
    try {
      await fetch(`/api/color/${selectedColor}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editColorName,
          color: editColorValue,
        }),
      });
      // Handle success or show notification
      setShowEditModal(false);
      setSelectedColor(null);
      setEditColorName("");
      setEditColorValue("");
    } catch (error) {
      console.error("Error updating color:", error);
      // Handle error or show notification
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`/api/color/${selectedColorId}`, { method: "DELETE" });
      setShowDeleteModal(false);
      toast.success(`The color has been deleted successfully`);
      router.push("/admin/colors");
      // location.reload(); // Recarga la página para actualizar la lista de colores
    } catch (error) {
      toast.error(`The color could not be erased`);
      console.error(error);
    }
  };

  const handleEditColor = (color: IColor) => {
    setSelectedColor(color);
    setEditColorName(color.name);
    setEditColorValue(color.color);
    setShowEditModal(true);
  };

  return (
    <AdminLayout>
      <div className="relative ml-[300px] mr-[50px] mt-[20px] h-screen shadow-md sm:rounded-lg">
        <div className="flex flex-col mt-2">
          <div className="flex flex-row items-center">
            <MdColorLens size="1.5rem" />
            <h2 className="text-left text-black ml-1 text-lg font-semibold">
              Colors for products
            </h2>
          </div>
          <div className="h-[35px] text-center flex justify-end w-full">
            <button onClick={handleClick}>
              <BiAddToQueue size="2rem" className="text-blue-600" />
            </button>
          </div>
          {showModal && (
            <div className="absolute right-0 mt-[55px] mr-1">
              <button
                className="absolute top-5 right-1 bg-black w-4 h-4 flex items-center justify-center rounded-full text-center"
                onClick={closeModal}
              >
                <ImCross className="text-white text-[0.50rem]" />
              </button>
              <div className="mt-4">
                <ColorPicker onClose={handleColorSave} />
              </div>
            </div>
          )}
          <div className="mt-2">
            <table className="w-[100%] text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-black dark:text-white">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name color
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Hex
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="items-center">
                {colors.map((color: IColor, index: number) => (
                  <tr
                    className="bg-white border-b dark:bg-white-800 text-black dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-200"
                    key={color._id}
                  >
                    <td className="px-6 py-4">{color.name}</td>
                    <td className="px-6 py-4 flex items-center justify-center">
                      <span className="uppercase mr-2">{color.color}</span>
                      <div
                        className={`w-4 h-4 mr-2 ${color.color}`}
                        style={{ backgroundColor: color.color }}
                      ></div>{" "}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-row justify-center">
                        <MdDeleteForever
                          size="1.2rem"
                          className="text-red-600 cursor-pointer mr-2"
                          onClick={() => handleDeleteClick(color._id)}
                        />
                        <FiEdit
                          size="1.2rem"
                          className="text-blue-600 cursor-pointer ml-2"
                          onClick={() => handleEditColor(color)}
                        />
                      </div>
                      {showDeleteModal && (
                        <div
                          className="fixed inset-0 flex items-center justify-center z-10 bg-gray-200 bg-opacity-10"
                          onClick={handleOutsideClick}
                        >
                          <div
                            className="bg-white rounded-lg p-8 shadow-sm"
                            onClick={handleModalClick}
                          >
                            <div className="flex flex-col items-center">
                              <MdDeleteForever
                                size="2rem"
                                className="text-red-600 mb-2"
                              />
                              <p className="text-lg font-semibold">
                                Are you sure you want to delete this color?
                              </p>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <button
                                className="bg-gray-200 rounded-md px-4 py-2 mr-2"
                                onClick={handleCancelDelete}
                              >
                                Cancel
                              </button>
                              <button
                                className="bg-red-600 rounded-md px-4 py-2 text-white"
                                onClick={handleConfirmDelete}
                              >
                                Delete
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
        </div>
      </div>
      {showEditModal && selectedColor && (
        <div className="absolute right-0 mt-[55px] mr-1">
          <button
            className="absolute top-5 right-1 bg-black w-4 h-4 flex items-center justify-center rounded-full text-center"
            onClick={closeModal}
          >
            <ImCross className="text-white text-[0.50rem]" />
          </button>
          <div className="mt-4">
            <EditColorPicker
              defaultColor={selectedColor.color}
              onClose={handleColorSave}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps(context: NextApiRequest) {
  await connect();
  try {
    const colors = await Color.find({}).exec();
    return {
      props: { colors: toJSON(colors) },
    };
  } catch (error) {
    console.error(error);
    return { props: { colors: [] } };
  }
}
