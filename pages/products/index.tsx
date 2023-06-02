import Layout from "@/components/layouts/layout";
import { connect } from "@/lib/db";
import Product from "@/models/Product";
import React, { useContext, useEffect, useState } from "react";
import { IProduct } from "../../interfaces/IProduct";
import { ICategory } from "../../interfaces/ICategory";
import { IColor } from "../../interfaces/IColor";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { ImCross } from "react-icons/im";
import Link from "next/link";
import toJSON from "@/lib/toJSON";
import { NextApiRequest } from "next";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import Favorite from "@/models/Favorite";
import Category from "@/models/Category";
import Color from "@/models/Color";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { TbArrowsSort } from "react-icons/tb";
import CartContext from "@/context/CartContext";
import { ProductCard } from "@/components/productCard";
import Pagination from "@/components/paginate";

interface CartState {
  cartItems: any[]; // Ajusta el tipo según la estructura de tu estado del carrito
}

interface SearchProps {
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
  cart: CartState;
  currentPage: any;

  //ProductCard
  product: IProduct;
  userFavs: string[];
  toggleFavorite: (productId: string) => void;
  handleAddToCart: (product: IProduct, size: string, quantity: number) => void;
  showSizes: boolean[];
  setShowSizes: React.Dispatch<React.SetStateAction<boolean[]>>;
  index: number;
}

// const PAGE_SIZE = 2;

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

const ratings = [1, 2, 3, 4, 5];

const ProductsScreen: React.FC<SearchProps> = (props) => {
  const {
    products,
    countProducts,
    categories,
    pages,
    colors,
    favorites,
    currentPage,
  } = props;
  const router = useRouter();
  const [userFavs, setUserFavs] = useState(favorites.map((fav: any) => fav));
  const [openCategories, setOpenCategories] = useState(false);
  const [openPrices, setOpenPrices] = useState(false);
  console.log(products);
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
  const { state, dispatch } = useContext(CartContext);

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

  const toggleFavorite = async (productId: string) => {
    const isFavorite = userFavs.includes(productId);

    if (isFavorite) {
      try {
        await fetch(
          `/api/favorites/delete/${session?.user.id}?productId=${productId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setUserFavs((prevFavorites: any) =>
          prevFavorites.filter((fav: any) => fav !== productId)
        );
      } catch (error) {
        console.error("Error deleting favorite:", error);
      }
    } else {
      try {
        await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: session?.user.id, productId }),
        });
        setUserFavs((prevFavorites: any) => [...prevFavorites, productId]);
      } catch (error) {
        console.error("Error adding favorite:", error);
      }
    }
  };

  const handleAddToCart = (product: any, size: any, quantity: any) => {
    const existingItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug && item.size === size
    );

    const selectedSize = product.sizes.find((item: any) => item.size === size);
    if (!selectedSize)
      return console.log("No se encontró el tamaño seleccionado");

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + 1;
      if (selectedSize.quantity < updatedQuantity) {
        return console.log(
          "No hay suficiente stock para actualizar el carrito"
        );
      }

      dispatch({
        type: "CART_UPDATE_ITEM_QUANTITY",
        payload: {
          id: existingItem._id, // o el identificador único del elemento del carrito
          size,
          quantity: updatedQuantity,
        },
      });
    } else {
      if (selectedSize.quantity < quantity) {
        return console.log("No hay suficiente stock para agregar al carrito");
      }

      const newItem = { ...product, quantity, size };
      dispatch({ type: "CART_ADD_ITEM", payload: newItem });
    }
  };

  const handlePageChange = (page: any) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page.toString() },
    });
  };

  return (
    <Layout
      title="Products"
      categories={categories}
      colors={colors}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      categoryHandler={categoryHandler}
      priceHandler={priceHandler}
      sexHandler={sexHandler}
      ratingHandler={ratingHandler}
      colorHandler={colorHandler}
    >
      <div className="grid md:grid-cols-4 md:gap-5 mt-[2.5rem] w-[97%] md:w-[91%] min-h-[calc(100vh-4rem)] ">
        {/* mobile */}

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

        {/* desktop */}
        <div className="bg-white hidden md:flex flex-col px-2 max-h-[20rem] mt-[1.7rem]">
          <div className="my-3">
            <div className="w-full border-[1px] border-slate-200 px-1 py-1">
              <div className="w-full flex justify-between items-center">
                <h2 className="uppercase font-semibold">Categories</h2>
                {openCategories ? (
                  <button
                    className="text-black text-xl font-semibold cursor-pointer"
                    onClick={() => setOpenCategories(false)}
                  >
                    <IoIosArrowForward />
                  </button>
                ) : (
                  <button
                    className="text-black text-xl font-semibold cursor-pointer"
                    onClick={() => setOpenCategories(true)}
                  >
                    <IoIosArrowDown />
                  </button>
                )}
              </div>
              {openCategories && (
                <div className="py-1 flex flex-col items-start">
                  <button
                    value="all"
                    onClick={() => categoryHandler("all")}
                    className="uppercase pl-1 text-sm w-full text-start hover:bg-slate-100"
                  >
                    All
                  </button>
                  {categories &&
                    categories.map((category) => (
                      <button
                        key={category._id}
                        className="uppercase pl-1 text-sm w-full text-start hover:bg-slate-100"
                        onClick={() => categoryHandler(category.name)}
                      >
                        {category.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* menu */}
          <div className="mb-3">
            <div className="w-full border-[1px] border-slate-200 px-1 py-1">
              <div className="w-full flex justify-between items-center">
                <h2 className="uppercase font-semibold">Prices</h2>
                {openPrices ? (
                  <button
                    className="text-black text-xl font-semibold cursor-pointer"
                    onClick={() => setOpenPrices(false)}
                  >
                    <IoIosArrowForward />
                  </button>
                ) : (
                  <button
                    className="text-black text-xl font-semibold cursor-pointer"
                    onClick={() => setOpenPrices(true)}
                  >
                    <IoIosArrowDown />
                  </button>
                )}
              </div>

              {openPrices && (
                <div className="py-1 flex flex-col items-start">
                  <button
                    value="all"
                    onClick={() => priceHandler("all")}
                    className="uppercase pl-1 text-sm w-full text-start hover:bg-slate-100"
                  >
                    All
                  </button>
                  {prices &&
                    prices.map((price) => (
                      <button
                        key={price.value}
                        className="uppercase pl-1 text-sm w-full text-start hover:bg-slate-100"
                        onClick={() => priceHandler(price.value)}
                      >
                        {price.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <h2 className="uppercase font-semibold">Colors</h2>
            <div className="w-full flex gap-2">
              <button
                className="h-4 w-4 border-[1px] border-slate-200 cursor-pointer text-center text-red"
                onClick={() => colorHandler("all")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {colors &&
                colors.map((color) => (
                  <button
                    key={color.name}
                    style={{ backgroundColor: color.color }}
                    className={`h-4 w-4  border-[1px] border-slate-200 cursor-pointer`}
                    value={color.name}
                    onClick={() => colorHandler(color.name)}
                  ></button>
                ))}
            </div>
          </div>

          <div className="mb-3 flex flex-col">
            <h2 className="uppercase font-semibold">Sex</h2>
            <div className="w-full flex gap-2">
              {sexCategories &&
                sexCategories.map((value, index) => (
                  <button
                    key={index}
                    className={`uppercase text-sm border-[1px] border-slate-200 px-2 ${
                      activeSex === value ? "active" : ""
                    }`}
                    style={{
                      backgroundColor: activeSex === value ? "black" : "white",
                      color: activeSex === value ? "white" : "black",
                    }}
                    onClick={() => sexHandler(value)}
                  >
                    {value}
                  </button>
                ))}
            </div>
          </div>

          <div className="mb-3">
            <h2 className="uppercase font-semibold">Ratings</h2>
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={`text-${
                  ratingStar !== null && ratingStar >= value ? "yellow" : "gray"
                }-400 cursor-pointer text-2xl`}
                onClick={() => ratingHandler(value)}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <div>
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
                      router.push("/products"),
                        setRatingStar(null),
                        setActiveSex("");
                    }}
                  >
                    <ImCross className="text-white text-[0.50rem]" />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-black relative shadow-md w-[14rem] hidden md:flex">
              <div className="w-full flex justify-between">
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
              {openFilter && (
                <div className="flex flex-col text-white absolute bg-black z-20 w-full px-2 py-2 shadow-md top-8">
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
              )}
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 md:grid md:grid-cols-4 w-[100%] gap-2 md:gap-4 md:m-auto">
              {products?.map((product: IProduct, index: number) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  userFavs={userFavs}
                  toggleFavorite={toggleFavorite}
                  handleAddToCart={handleAddToCart}
                  showSizes={showSizes}
                  setShowSizes={setShowSizes}
                  index={index}
                />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={pages} />

            {/* <ul className="flex items-center justify-center">
              <li>
                <button
                  className="default-button m-2 px-1 py-1 bg-black text-white cursor-pointer"
                  onClick={() => pageHandler(+page - 1)}
                  disabled={+page === 1}
                >
                  <FiChevronLeft className="text-2xl" />
                </button>
              </li>
              {products.length > 0 && (
                <>
                  {Array.from(Array(pages).keys()).map((pageNumber) => {
                    if (pageNumber < 5 || pageNumber === pages - 1) {
                      return (
                        <li key={pageNumber}>
                          <button
                            className={`default-button m-2 ${
                              +page === pageNumber + 1
                                ? "bg-gray-300 px-3 py-1 font-semibold"
                                : "px-3 py-1 font-semibold"
                            } `}
                            onClick={() => pageHandler(pageNumber + 1)}
                          >
                            {pageNumber + 1}
                          </button>
                        </li>
                      );
                    } else if (pageNumber === 5) {
                      return (
                        <li key={pageNumber}>
                          <span className="m-2">...</span>
                        </li>
                      );
                    }
                  })}
                </>
              )}
              <li>
                <button
                  className="default-button m-2 px-1 py-1 bg-black text-white cursor-pointer"
                  onClick={() => pageHandler(+page + 1)}
                  disabled={+page === pages}
                >
                  <FiChevronRight className="text-2xl " />
                </button>
              </li>
            </ul> */}

            {/* codigo providional */}
            {/* <ul className="flex">
              <li>
                <button
                  className="default-button m-2"
                  onClick={() => pageHandler(+page - 1)}
                  disabled={+page === 1}
                >
                  <p>ñ</p>
                </button>
              </li>
              {products.length > 0 &&
                Array.from(Array(pages).keys()).map((pageNumber) => (
                  <li key={pageNumber}>
                    <button
                      className={`default-button m-2 ${
                        +page === pageNumber + 1 ? "font-bold" : ""
                      } `}
                      onClick={() => pageHandler(pageNumber + 1)}
                    >
                      {pageNumber + 1}
                    </button>
                  </li>
                ))}
              <li>
                <button
                  className="default-button m-2"
                  onClick={() => pageHandler(+page + 1)}
                  disabled={+page === pages}
                >
                 <p>k</p>
                </button>
              </li>
            </ul> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsScreen;

export async function getServerSideProps({
  query,
  req,
}: {
  query: NextApiRequest["query"];
  req: NextApiRequest;
}) {
  const page = parseInt(query.page as string, 10) || 1;
  const pageSize = 16;
  const skip = (page - 1) * pageSize;
  const filters: any = {};
  const searchQuery = (query.query as string) || "";
  const category = (query.category as string) || "";
  const color = (query.color as string) || "";
  const sex = (query.sex as string) || "";
  const price = (query.price as string) || "";
  const rating = (query.rating as string) || "";
  const sort = (query.sort as string) || "";

  const session = await getSession({ req });
  console.log("session:", session);

  if (searchQuery && searchQuery !== "all") {
    filters.name = { $regex: searchQuery, $options: "i" };
  }
  if (category && category !== "all") {
    const categoryObj = (await Category.findOne({ name: category })
      .lean()
      .exec()) as ICategory;
    if (categoryObj) {
      filters.category = categoryObj._id;
    }
  }
  if (color && color !== "all") {
    const colorObj = (await Color.findOne({ name: color })
      .lean()
      .exec()) as IColor;
    if (colorObj) {
      filters.color = colorObj._id;
    }
  }
  if (rating && rating !== "all") {
    filters.rating = { $eq: Number(rating) }; // Filtrar por rating igual al seleccionado
    if (rating !== "5") {
      // Agregar filtro adicional para ratings menores a 5
      filters.rating.$lte = Number(rating);
    }
  }
  if (price && price !== "all") {
    const [minPrice, maxPrice] = price.split("-");
    filters.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  }
  if (sex && sex !== "all") {
    filters.sex = sex;
  }

  await connect(); // Connect to your MongoDB database

  const [favorites, categories, colors, totalProductsCount, products] =
    await Promise.all([
      Favorite.find({ user: session?.user?.id })
        .populate("product", "-reviews")
        .select("product")
        .lean()
        .exec(),
      Category.find().select("name").lean(),
      Color.find().lean(),
      Product.countDocuments(filters)
        .lean()
        .exec()
        .then((count) => Number(count)),
      Product.find(filters, "-reviews")
        .populate("category", "name")
        .populate("color", "name")
        .select("name")
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

  const favoriteProductIds = favorites?.map(
    (favorite: any) => favorite?.product?._id
  );

  return {
    props: {
      products: toJSON(products as IProduct[]),
      currentPage: page,
      pages: Math.ceil(totalProductsCount / pageSize),
      categories: toJSON(categories as any),
      colors: toJSON(colors as any),
      favorites: toJSON(favoriteProductIds),
    },
  };
}
