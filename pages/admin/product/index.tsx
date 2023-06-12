import ColorPicker from "@/components/ColorPicker";
import ModalEditProduct from "@/components/ModalEditProduct";
import AdminLayout from "@/components/layouts/adminLayout";
import Pagination from "@/components/paginate";
import { ICategory } from "@/interfaces/ICategory";
import { IColor } from "@/interfaces/IColor";
import { IProduct } from "@/interfaces/IProduct";
import { connect } from "@/lib/db";
import toJSON from "@/lib/toJSON";
import Category from "@/models/Category";
import Color from "@/models/Color";
import Product from "@/models/Product";
import { NextApiRequest } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { HiShoppingBag } from "react-icons/hi";
import { ImCross } from "react-icons/im";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { MdCategory, MdColorLens, MdDeleteForever } from "react-icons/md";
import { TbArrowsSort } from "react-icons/tb";

interface ProductsProps {
  products: IProduct[];
  countProducts: number;
  categories: ICategory[];
  pages: number;
  colors: IColor[];
  favorites: any;
  showFilters: boolean;
  categoryHandler: (category: string) => void;
  priceHandler: (price: string) => void;
  sexHandler: (sex: string) => void;
  ratingHandler: (rating: number) => void;
  colorHandler: (color: string) => void;
  currentPage: any;
}

export default function AdminProducts(
  props: ProductsProps
): React.ReactElement {
  const { products, countProducts, categories, pages, colors, currentPage } =
    props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const [openCategories, setOpenCategories] = useState(false);
  const [openPrices, setOpenPrices] = useState(false);
  // console.log(products);
  const { data: session } = useSession();
  const [ratingStar, setRatingStar] = useState<number | null>(null);
  const [filter, setFilter] = useState("Newest");
  const [openFilter, setOpenFilter] = useState(false);
  const [activeSex, setActiveSex] = useState("");
  const [showSizes, setShowSizes] = useState(
    Array(products.length).fill(false)
  );
  // const [selectedSizes, setSelectedSizes] = useState(
  //   Array(products.length).fill("")
  // );
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [productId, setProductId] = useState("");

  const {
    query = "all",
    category = "all",
    price = "all",
    color = "all",
    rating = "all",
    // sort = "featured",
    page = "1",
    sex = "all",
  } = router.query;

  const prices = [
    {
      name: "$1 to $50",
      value: "1-50",
    },
    {
      name: "$51 to $200",
      value: "51-200",
    },
    {
      name: "$201 to $1000",
      value: "201-1000",
    },
  ];

  const sexCategories = ["Men", "Women"];

  const filterSearch = ({
    page,
    category,
    color,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
    sex,
  }: {
    page?: string;
    category?: string;
    color?: string;
    sort?: string;
    min?: string;
    max?: string;
    searchQuery?: string;
    price?: string;
    rating?: string;
    sex?: string;
  }) => {
    const newQuery = { ...router.query };

    if (page) newQuery.page = page;
    if (searchQuery) newQuery.searchQuery = searchQuery;
    if (sort) newQuery.sort = sort;
    if (category) newQuery.category = category;
    if (color) newQuery.color = color;
    if (price) newQuery.price = price;
    if (sex) newQuery.sex = sex;
    if (rating) newQuery.rating = rating;
    if (min)
      newQuery.min = newQuery.min
        ? newQuery.min
        : newQuery.min === "0"
        ? "0"
        : min;
    if (max)
      newQuery.max = newQuery.max
        ? newQuery.max
        : newQuery.max === "0"
        ? "0"
        : max;

    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  };

  const categoryHandler = (category: string) => {
    filterSearch({ category: category });
  };

  const pageHandler = (page: number) => {
    filterSearch({ page: page.toString() });
  };

  const sortHandler = (sort: string) => {
    filterSearch({ sort });
    setFilter(sort);
    setOpenFilter(false);
  };

  const priceHandler = (price: string) => {
    filterSearch({ price });
  };

  const sexHandler = (sex: string) => {
    if (sex === activeSex) {
      setActiveSex("");
      filterSearch({ sex: "all" }); // Eliminar filtro
    } else {
      setActiveSex(sex);
      filterSearch({ sex });
    }
  };

  const ratingHandler = (rating: number) => {
    const ratingString = rating.toString();
    if (rating === ratingStar) {
      setRatingStar(0);
      filterSearch({ rating: "all" });
    } else {
      filterSearch({ rating: ratingString });
      setRatingStar(rating);
    }
  };

  const colorHandler = (color: string) => {
    filterSearch({ color });
  };

  const handlePageChange = (page: any) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page.toString() },
    });
  };

  const handleDeleteClick = () => {
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

  const calculateDiscountPercentage = (
    price: number,
    discountValue: number
  ) => {
    const discountPercentage = (discountValue / price) * 100;
    return discountPercentage;
  };

  const deleteProduct = async (productId: string) => {
    try {
      await fetch(`/api/product/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  const handleConfirmDelete = (productId: string) => {
    deleteProduct(productId);
    setShowDeleteModal(false);
  };

  return (
    <AdminLayout>
      <div className="relative ml-[300px] mr-[50px] mt-[20px] h-screen shadow-md sm:rounded-lg">
        <div className="flex flex-row items-center">
          <HiShoppingBag size="1.5rem" />
          <h2 className="text-left text-black ml-1 text-lg font-semibold">
            Products List
          </h2>
        </div>
        <div className="md:col-span-3">
          <div className="w-full md:hidden flex justify-between h-[2.5rem] mb-5 relative">
            <button
              className="w-full h-full px-2 font-semibold text-xl bg-gray-300"
              onClick={() => {
                setShowFilters(!showFilters), setShowSort(false);
              }}
            >
              FILTERS
            </button>
            <button
              className="w-full h-full px-2 font-semibold text-xl bg-gray-300 uppercase"
              onClick={() => {
                setShowSort(!showSort), setShowFilters(false);
              }}
            >
              SORT BY {filter === "featured" ? "Features" : filter}
            </button>

            {showSort && (
              <div className="w-full bg-gray-300 min-h-[10rem] absolute z-20 top-[2.45rem] shadow-md">
                <div className="flex flex-col text-white absolute w-full px-2 py-2">
                  <button
                    className="w-full text-start"
                    onClick={() => sortHandler("featured")}
                  >
                    Featured
                  </button>
                  <button
                    className="w-full text-start"
                    onClick={() => sortHandler("lowest")}
                  >
                    Price: Low to High
                  </button>
                  <button
                    className="w-full text-start"
                    onClick={() => sortHandler("highest")}
                  >
                    Price: High to Low
                  </button>
                  <button
                    className="w-full text-start"
                    onClick={() => sortHandler("toprated")}
                  >
                    Customer Reviews
                  </button>
                  <button
                    className="w-full text-start"
                    onClick={() => sortHandler("newest")}
                  >
                    Newest Arrivals
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative w-[100%] hidden md:flex items-center justify-between mb-[10px]">
            <div className="flex flex-row justify-start gap-2">
              <div className="bg-black w-[100%] h-[35px] flex justify-between">
                <button className="w-full text-white px-2 py-1 flex items-center gap-2 uppercase">
                  <TbArrowsSort className="text-xl" />
                  Sort by {filter === "newest" ? "Newest" : filter}
                </button>
                {openFilter ? (
                  <button
                    className="text-white text-xl font-semibold cursor-pointer px-2"
                    onClick={() => setOpenFilter(false)}
                  >
                    <IoIosArrowForward className="text-white" />
                  </button>
                ) : (
                  <button
                    className="text-white text-xl font-semibold cursor-pointer px-2"
                    onClick={() => setOpenFilter(true)}
                  >
                    <IoIosArrowDown className="text-white" />
                  </button>
                )}
              </div>
              <div className="w-[50%] bg-black relative border-slate-200 px-2 py-1">
                <div className="w-full flex justify-between items-center">
                  <h2 className="uppercase text-white">Categories</h2>
                  {openCategories ? (
                    <button
                      className="text-white text-xl font-semibold cursor-pointer"
                      onClick={() => setOpenCategories(false)}
                    >
                      <IoIosArrowForward />
                    </button>
                  ) : (
                    <button
                      className="text-white text-xl font-semibold cursor-pointer"
                      onClick={() => setOpenCategories(true)}
                    >
                      <IoIosArrowDown />
                    </button>
                  )}
                </div>
                {openCategories && (
                  <div className="py-1 flex flex-col absolute bg-black right-0 text-white w-[100%] items-start">
                    <button
                      value="all"
                      onClick={() => categoryHandler("all")}
                      className="uppercase pl-1 text-sm w-full text-start"
                    >
                      All
                    </button>
                    {categories &&
                      categories.map((category) => (
                        <button
                          key={category._id}
                          className="uppercase pl-1 text-sm w-full text-start"
                          onClick={() => categoryHandler(category.name)}
                        >
                          {category.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white hidden md:flex flex-row px-2 max-h-[20rem]">
              <div className="flex flex-row items-center">
                {/* <h2 className="uppercase font-semibold">Sex</h2> */}
                <div className="w-full flex gap-2 mr-3">
                  {sexCategories &&
                    sexCategories.map((value, index) => (
                      <button
                        key={index}
                        className={`uppercase text-sm border-[1px] border-slate-200 px-2 ${
                          activeSex === value ? "active" : ""
                        }`}
                        style={{
                          backgroundColor:
                            activeSex === value ? "black" : "white",
                          color: activeSex === value ? "white" : "black",
                        }}
                        onClick={() => sexHandler(value)}
                      >
                        {value}
                      </button>
                    ))}
                </div>
              </div>

              <div className="h-[35px] w-[40px] text-center">
                <button>
                  <BiAddToQueue size="2rem" className="text-blue-600" />
                </button>
              </div>
            </div>
            {openFilter && (
              <div className="flex flex-col text-white absolute bg-black z-20 w-[19%] px-2 py-2 shadow-md top-8">
                <button
                  className="w-full text-start"
                  onClick={() => sortHandler("featured")}
                >
                  Featured
                </button>
                <button
                  className="w-full text-start"
                  onClick={() => sortHandler("lowest")}
                >
                  Price: Low to High
                </button>
                <button
                  className="w-full text-start"
                  onClick={() => sortHandler("highest")}
                >
                  Price: High to Low
                </button>
                <button
                  className="w-full text-start"
                  onClick={() => sortHandler("newest")}
                >
                  Newest Arrivals
                </button>
              </div>
            )}
          </div>

          <div className="md:col-span-3 mb-2 flex items-center justify-between">
            {((query !== "all" && query !== "") ||
              category !== "all" ||
              color !== "all" ||
              sex !== "all" ||
              rating !== "all" ||
              price !== "all") && (
              <div className="flex items-center gap-1 border-[1px] border-slate-200 px-2 py-1 text-sm uppercase">
                {products.length === 0 ? "NOT FOUND" : countProducts}
                {query !== "all" && query !== " " && " : " + query}
                {category !== "all" && " " + category}
                {color !== "all" && "  " + color}
                {sex !== "all" && "  " + sex}
                {price !== "all" && "  Price " + price}
                {rating !== "all" && "  Rating " + rating}
                &nbsp;
                <button
                  className="bg-black w-4 h-4 flex items-center justify-center rounded-full text-center"
                  onClick={() => {
                    router.push("/admin/products"),
                      setRatingStar(null),
                      setActiveSex("");
                  }}
                >
                  <ImCross className="text-white text-[0.50rem]" />
                </button>
              </div>
            )}
          </div>

          <div>
            <table className="w-[100%] text-sm text-gray-500 dark:text-gray-400 text-center">
              <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-black dark:text-white">
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
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Prices
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="items-center">
                {products.map((prod: IProduct, index: any) => (
                  <tr
                    className="bg-white border-b dark:bg-white-800 text-black dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-200"
                    key={prod._id}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black flex"
                    >
                      <img
                        src={prod.image}
                        alt="product"
                        className="w-[50px] h-[55px]"
                      />
                      <div className="flex flex-col text-left">
                        <Link href={`/admin/product/${prod.slug}`}>
                          <span className="ml-2 text-blue-600">
                            {prod.name}
                          </span>
                        </Link>
                        <span className="ml-2 text-black">{prod.sex}</span>
                      </div>
                    </th>
                    <td className="px-6 py-4">{prod.color.name}</td>
                    <td className="px-6 py-4">{prod.category.name}</td>
                    <td className="px-6 py-4">{prod.stock}</td>
                    <td className="px-6 py-4">
                      {prod.discount && prod.discount.isActive && (
                        <p>
                          {calculateDiscountPercentage(
                            prod.price,
                            prod.discount.value
                          )}
                          % OFF
                        </p>
                      )}
                      {!prod.discount && <p>0% OFF</p>}
                    </td>
                    {/* <td className="px-6 py-4">{prod.price}$</td> */}
                    <td className="px-6 py-4">
                      {prod.discount?.isActive ? (
                        <span className="font-semibold text-lg flex flex-col">
                          ${prod.price * (1 - prod.discount.value / 100)}{" "}
                          <span className="text-red-500 line-through">
                            ${prod.price}
                          </span>
                        </span>
                      ) : (
                        <span className="font-semibold text-lg">
                          ${prod.price}{" "}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 mb-4">
                      <div className="flex justify-around">
                        <ModalEditProduct product={prod} />
                        <MdDeleteForever
                          size="1.2rem"
                          className="text-red-600 cursor-pointer"
                          onClick={handleDeleteClick}
                        />
                      </div>
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
                                onClick={() => handleConfirmDelete(prod._id)}
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
            <Pagination currentPage={currentPage} totalPages={pages} />
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
  const color = (query.color as string) || "";
  const sex = (query.sex as string) || "";
  const price = (query.price as string) || "";
  const rating = (query.rating as string) || "";
  const sort = (query.sort as string) || "";

  if (searchQuery && searchQuery !== "all") {
    filter.name = { $regex: searchQuery, $options: "i" };
  }
  if (category && category !== "all") {
    const categoryObj = (await Category.findOne({ name: category })
      .lean()
      .exec()) as ICategory;
    if (categoryObj) {
      filter.category = categoryObj._id;
    }
  }
  if (color && color !== "all") {
    const colorObj = (await Color.findOne({ name: color })
      .lean()
      .exec()) as IColor;
    if (colorObj) {
      filter.color = colorObj._id;
    }
  }
  if (rating && rating !== "all") {
    filter.rating = { $eq: Number(rating) };
    if (rating !== "5") {
      filter.rating.$lte = Number(rating);
    }
  }
  if (price && price !== "all") {
    const [minPrice, maxPrice] = price.split("-");
    filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  }
  if (sex && sex !== "all") {
    filter.sex = sex;
  }

  await connect();

  const [categories, colors, totalProductsCount, products] = await Promise.all([
    Category.find().select("name").lean(),
    Color.find().lean(),
    Product.countDocuments(filter)
      .lean()
      .exec()
      .then((count) => Number(count)),
    Product.find(filter, "-reviews")
      .populate("category", "name")
      .populate("color", "name")
      .select("name sizes price discount")
      .sort(
        sort === "featured"
          ? { isFeatured: -1 }
          : sort === "lowest"
          ? { price: 1 }
          : sort === "highest"
          ? { price: -1 }
          : sort === "toprated"
          ? { rating: -1 }
          : sort === "newest"
          ? { createdAt: -1 }
          : { _id: -1 }
      )
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec(),
  ]);

  return {
    props: {
      products: toJSON(products as IProduct[]),
      currentPage: page,
      pages: Math.ceil(totalProductsCount / pageSize),
      categories: toJSON(categories as any),
      colors: toJSON(colors as any),
    },
  };

  // const color = await Color.find();
  // const category = await Category.find();

  // const allProducts = await Product.find()
  //   .populate("color", "name")
  //   .populate("sizes", "size")
  //   .populate("category", "name");
}
