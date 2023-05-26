import Layout from "@/components/layouts/layout";
import { connect } from "@/lib/db";
import Product from "@/models/Product";
import React, { Suspense, use, useState } from "react";
import { IProduct } from "../../interfaces/IProduct";
import { ICategory } from "../../interfaces/ICategory";
import { IColor } from "../../interfaces/IColor";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import toJSON from "@/lib/toJSON";
import { NextApiRequest } from "next";
import Paginate from "@/components/paginate";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import User from "@/models/User";
import Favorite from "@/models/Favorite";
import { IUser } from "@/interfaces/IUser";
import Category from "@/models/Category";
import Color from "@/models/Color";
import { IndexKind } from "typescript";

interface SearchProps {
  products: IProduct[];
  countProducts: number;
  categories: ICategory[];
  pages: number;
  colors: IColor[];
  favorites: any;
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
  } = props;
  const router = useRouter();
  const [userFavs, setUserFavs] = useState(favorites.map((fav: any) => fav));
  const { data: session } = useSession();
  console.log(session);

  console.log(categories);
  const {
    query = "all",
    category = "all",
    price = "all",
    color = "all",
    rating = "all",
    sort = "featured",
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
    const query = { ...router.query };

    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (color) query.color = color;
    if (price) query.price = price;
    if (sex) query.sex = sex;
    if (rating) query.rating = rating;
    if (min) query.min = query.min ? query.min : query.min === "0" ? "0" : min;
    if (max) query.max = query.max ? query.max : query.max === "0" ? "0" : max;

    router.push({
      pathname: router.pathname,
      query: query,
    });
  };

  const categoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    filterSearch({ category: e.target.value });
  };
  const colorHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    filterSearch({ color: e.target.value });
  };

  const pageHandler = (page: number) => {
    filterSearch({ page: page.toString() });
  };

  const sortHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    filterSearch({ sort: e.target.value });
  };

  const priceHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    filterSearch({ price: e.target.value });
  };

  const sexHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    filterSearch({ sex: e.target.value });
  };

  const ratingHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    filterSearch({ rating: e.target.value });
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
  return (
    <Layout title="Products">
      <div className="grid md:grid-cols-4 md:gap-5 mt-[4rem] w-[95%]">
        <div className="bg-white flex flex-col px-2 max-h-[20rem]">
          <div className="my-3">
            <h2>Categories</h2>
            <select
              className="w-full bg-black text-white"
              value={category}
              onChange={categoryHandler}
            >
              <option value="all">All</option>
              {categories &&
                categories.map((category) => (
                  <option key={category?._id} value={category?.name}>
                    {category?.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-3">
            <h2>Prices</h2>
            <select
              className="w-full  bg-black text-white"
              value={price}
              onChange={priceHandler}
            >
              <option value="all">All</option>
              {prices &&
                prices.map((price) => (
                  <option key={price.value} value={price.value}>
                    {price.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-3">
            <h2>Sex</h2>
            <select
              className="w-full  bg-black text-white"
              value={sex}
              onChange={sexHandler}
            >
              <option value="all">All</option>
              {sexCategories &&
                sexCategories.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <h2>Color</h2>
            <select
              className="w-full  bg-black text-white"
              value={color}
              onChange={colorHandler}
            >
              <option value="all">All</option>
              {colors &&
                colors.map((color) => (
                  <option key={color._id} value={color.name}>
                    {color.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <h2>Ratings</h2>
            <select
              className="w-full  bg-black text-white"
              value={rating}
              onChange={ratingHandler}
            >
              <option value="all">All</option>
              {ratings &&
                ratings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} star{rating > 1 && "s"} & up
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="mb-2 flex items-center justify-between border-b-2 pb-2">
            <div className="flex items-center">
              {products.length === 0 ? "No" : countProducts} Results
              {query !== "all" && query !== "" && " : " + query}
              {category !== "all" && " : " + category}
              {color !== "all" && " : " + color}
              {price !== "all" && " : Price " + price}
              {rating !== "all" && " : Rating " + rating + " & up"}
              &nbsp;
              {(query !== "all" && query !== "") ||
              category !== "all" ||
              color !== "all" ||
              rating !== "all" ||
              price !== "all" ? (
                <button onClick={() => router.push("/products")}>
                  <p>X</p>
                </button>
              ) : null}
            </div>
            <div>
              Sort by{" "}
              <select value={sort} onChange={sortHandler}>
                <option value="featured">Featured</option>
                <option value="lowest">Price: Low to High</option>
                <option value="highest">Price: High to Low</option>
                <option value="toprated">Customer Reviews</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 md:grid md:grid-cols-4 w-[100%] gap-2 md:gap-6 md:m-auto">
              {products?.map((product: IProduct) => (
                <div
                  key={product._id}
                  className="bg-white w-[100%] md:w-[100%] h-[262px] md:h-[100%] m-auto hover:shadow-2xl shadow-lg text-left relative"
                >
                  <Link href={`/products/${product.slug}`}>
                    <img
                      src={product.image}
                      alt="products"
                      className="w-[300px] h-[180px] md:h-[200px] m-auto mt-0 mb-0 object-cover bg-center"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <Link href={`/products/${product.slug}`}>
                      <span className="text-[#828282] font-semibold mt-2 md:mt-2 text-[12px] ml-2">
                        {product.name}
                      </span>
                    </Link>

                    <span className="text-[#828282] font-bold text-[16px] md:text-[15px] ml-2">
                      {product.price}$
                    </span>
                  </div>
                  {userFavs.includes(product._id) ? (
                    <button
                      className="absolute bottom-[90%] left-[85%] md:bottom-[92%] md:left-[90%]"
                      onClick={() => toggleFavorite(product._id)}
                    >
                      <BsSuitHeartFill className="text-red-500" size="1rem" />
                    </button>
                  ) : (
                    <button
                      className="absolute bottom-[90%] left-[85%] md:bottom-[92%] md:left-[90%]"
                      onClick={() => toggleFavorite(product._id)}
                    >
                      <BsSuitHeart className="text-blue-500" size="1rem" />
                    </button>
                  )}

                  <button className="bg-black text-[10px] text-center text-white m-auto flex items-center justify-center p-1 w-[60%] md:w-[80%] md:mb-2 mb-1 md:mt-1 mt-1">
                    <span className="md:text-[12px]">Add to cart</span>
                    <FaShoppingCart className="ml-2" />
                  </button>
                </div>
              ))}
            </div>

            <ul className="flex items-center justify-center">
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
            </ul>

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
  const userEmail = session?.user?.email || "";

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
    filters.rating = { $gte: Number(rating) };
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
      Color.find().select("name").lean(),
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

  console.log("category", categories);
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
