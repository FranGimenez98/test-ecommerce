import Hero from "@/components/hero";
import Layout from "@/components/layouts/layout";
import { IProduct } from "@/interfaces/IProduct";
import { connect } from "@/lib/db";
import toJSON from "@/lib/toJSON";
import Product from "@/models/Product";
import { useSession, getSession } from "next-auth/react";
import { useContext, useEffect, useState, useRef } from "react";
import Link from "next/link";
import CartContext from "@/context/CartContext";
import { NextApiRequest } from "next";
import Favorite from "@/models/Favorite";
import { ProductCardHome } from "@/components/productCardHome";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import dynamic from "next/dynamic";
import { motion, useInView, useAnimation } from "framer-motion";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";

export interface HomeProps {
  products: IProduct[];
  favorites: string[];
  populars: IProduct[];
  onSale: IProduct[];
  isOpenWishlistMessage?: boolean | undefined;
  setIsOpenWishlistMessage?: (bool: boolean) => void | undefined;
}

export default function Home({
  products,
  favorites,
  populars,
  onSale,
}: HomeProps) {
  const { state, dispatch } = useContext(CartContext);
  const [userFavs, setUserFavs] = useState(favorites.map((fav: any) => fav));
  const [showSizes, setShowSizes] = useState(
    Array(products.length).fill(false)
  );
  const [showSizesPopulars, setShowSizesPopulars] = useState(
    Array(populars.length).fill(false)
  );
  const [showSizesOnSale, setShowSizesOnSale] = useState(
    Array(onSale.length).fill(false)
  );
  const [openCategories, setOpenCategories] = useState(false);
  const { data: session } = useSession();

  const [isOpenWishlistMessage, setIsOpenWishlistMessage] = useState(false);

  const toggleFavorite = async (productId: string, productName: string) => {
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
        toast.success(`${productName} added to wishlist`);
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
      toast.success(`${product.name} added to cart`);
    } else {
      if (selectedSize.quantity < quantity) {
        return console.log("No hay suficiente stock para agregar al carrito");
      }

      let price = product.price;
      if (product.discount.isActive) {
        const discountValue = product.discount.value;
        const discountedPrice = price - (price * discountValue) / 100;
        price = discountedPrice;
      }

      const newItem = { ...product, quantity, size, price };
      dispatch({ type: "CART_ADD_ITEM", payload: newItem });
      toast.success(`${product.name} added to cart`);
    }
  };

  //animations
  //cards refs
  const popularsRef = useRef(null);
  const salesRef = useRef(null);
  const newArrivalsRef = useRef(null);

  //mobile refs
  const mobilePopularRef = useRef(null);
  const mobileSalesRef = useRef(null);
  const mobileNewArrivalsRef = useRef(null);

  //view all refs
  const popularsViewAll = useRef(null);
  const salesViewAll = useRef(null);
  const newArrivalsViewAll = useRef(null);

  //cards useInView
  const isInViewPopulars = useInView(popularsRef, { once: true });
  const isInViewSales = useInView(salesRef, { once: true });
  const isInViewArrivals = useInView(newArrivalsRef, { once: true });

  const isInViewMobilePopularRef = useInView(mobilePopularRef, { once: true });
  const isInViewMobileSalesRef = useInView(mobileSalesRef, { once: true });
  const isInViewMobileNewArrivalsRef = useInView(mobileNewArrivalsRef, {
    once: true,
  });

  //view all useInView
  const isInViewPopularsViewAll = useInView(popularsViewAll, { once: true });
  const isInViewSalesViewAll = useInView(salesViewAll, { once: true });
  const isInViewArrivalsViewAll = useInView(newArrivalsViewAll, { once: true });

  //cards
  const cardControls = useAnimation();
  const salesControls = useAnimation();
  const newArrivalsControls = useAnimation();

  //mobile
  const mobileCardControls = useAnimation();
  const mobileSalesControls = useAnimation();
  const mobileNewArrivalsControls = useAnimation();

  //view all
  const popularsViewAllControls = useAnimation();
  const salesViewAllControls = useAnimation();
  const newArrivalsViewAllControls = useAnimation();

  useEffect(() => {
    if (isInViewPopulars) cardControls.start("visible");
    if (isInViewSales) salesControls.start("visible");
    if (isInViewArrivals) newArrivalsControls.start("visible");

    if (isInViewMobilePopularRef) mobileCardControls.start("visible");
    if (isInViewMobileSalesRef) mobileSalesControls.start("visible");
    if (isInViewMobileNewArrivalsRef)
      mobileNewArrivalsControls.start("visible");

    if (isInViewPopularsViewAll) popularsViewAllControls.start("visible");
    if (isInViewSalesViewAll) salesViewAllControls.start("visible");
    if (isInViewArrivalsViewAll) newArrivalsViewAllControls.start("visible");
  }, [
    isInViewPopulars,
    isInViewSales,
    isInViewArrivals,
    isInViewPopularsViewAll,
    isInViewSalesViewAll,
    isInViewArrivalsViewAll,
    isInViewMobilePopularRef,
    isInViewMobileSalesRef,
    isInViewMobileNewArrivalsRef,
  ]);

  console.log(showSizes);
  return (
    <Layout
      isOpenWishlistMessage={isOpenWishlistMessage}
      setIsOpenWishlistMessage={setIsOpenWishlistMessage}
    >
      <section
        className="min-h-screen w-full flex flex-col items-center"
        // initial={{ width: 0 }}
        // animate={{ width: "100%" }}
        // exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
      >
        <Hero />
        {populars.length ? (
          <motion.div
            className="md:w-[91%] w-[97%] md:h-[calc(100vh-4rem)] mt-[2rem] md:mt-0 md:flex items-center justify-center flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-full flex justify-between items-end mt-[6rem]">
              <motion.h2
                className="mt-12 mb-2 text-2xl font-semibold uppercase"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ type: "easeIn", duration: 0.8 }}
                viewport={{ once: true }}
              >
                POPULARS
              </motion.h2>
              <motion.div
                ref={popularsViewAll}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "easeIn", duration: 0.8 }}
                viewport={{ once: true }}
                animate={popularsViewAllControls}
                className="mb-2 md:mb-1"
              >
                <Link
                  href="/products?rating=5"
                  className="font-semibold underline text-sm"
                >
                  View All
                </Link>
              </motion.div>
            </div>

            {/* mobile */}
            <motion.div
              ref={mobilePopularRef}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1, // Adjust the stagger delay as needed
                  },
                },
              }}
              initial="hidden"
              animate={mobileCardControls}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Splide
                options={{
                  arrows: false,
                  pagination: false,
                  drag: "free",
                  autoplay: true,
                  rewind: true,
                  interval: 4000,
                  breakpoints: {
                    640: {
                      perPage: 2,
                      gap: "10px",
                    },
                  },
                }}
                className="md:hidden"
              >
                {populars?.map((product, index) => (
                  <SplideSlide key={product._id}>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 75 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                    >
                      <ProductCardHome
                        product={product}
                        userFavs={userFavs}
                        toggleFavorite={toggleFavorite}
                        handleAddToCart={handleAddToCart}
                        showSizes={showSizesPopulars}
                        setShowSizes={setShowSizesPopulars}
                        setIsOpenWishlistMessage={
                          setIsOpenWishlistMessage || undefined
                        }
                        index={index}
                      />
                    </motion.div>
                  </SplideSlide>
                ))}
              </Splide>
            </motion.div>

            <motion.div
              ref={popularsRef}
              className="hidden md:grid grid-cols-5 gap-4"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1, // Adjust the stagger delay as needed
                  },
                },
              }}
              initial="hidden"
              animate={cardControls}
              transition={{ duration: 1, delay: 0.5 }} // Adjust the duration and delay values
            >
              {populars?.map((product, index) => (
                <motion.div
                  key={product._id}
                  variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.8, delay: index * 0.3 }} // Adjust the delay for each card
                >
                  <ProductCardHome
                    product={product}
                    userFavs={userFavs}
                    toggleFavorite={toggleFavorite}
                    handleAddToCart={handleAddToCart}
                    showSizes={showSizesPopulars}
                    setShowSizes={setShowSizesPopulars}
                    setIsOpenWishlistMessage={
                      setIsOpenWishlistMessage || undefined
                    }
                    index={index}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <div></div>
        )}

        <motion.div
          className="md:w-[91%] w-[97%] md:h-[calc(100vh-4rem)] mt-[5rem] md:flex items-center justify-center flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full flex justify-between items-end">
            <motion.h2
              className="mt-12 mb-2 text-2xl font-semibold uppercase"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ type: "easeIn", duration: 0.8 }}
              viewport={{ once: true }}
            >
              Sale
            </motion.h2>
            <motion.div
              ref={salesViewAll}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: "easeIn", duration: 0.8 }}
              viewport={{ once: true }}
              animate={salesViewAllControls}
              className="mb-2 md:mb-1"
            >
              <Link
                href="/products?sort=newest"
                className="font-semibold underline text-sm"
              >
                View All
              </Link>
            </motion.div>
          </div>

          <motion.div
            ref={mobileSalesRef}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1, // Adjust the stagger delay as needed
                },
              },
            }}
            initial="hidden"
            animate={mobileSalesControls}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Splide
              options={{
                arrows: false,
                pagination: false,
                drag: "free",
                autoplay: true,
                rewind: true,
                interval: 4000,
                breakpoints: {
                  640: {
                    perPage: 2,
                    gap: "10px",
                  },
                },
              }}
              className="md:hidden"
            >
              {onSale?.map((product, index) => (
                <SplideSlide key={product._id}>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 75 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <ProductCardHome
                      product={product}
                      userFavs={userFavs}
                      toggleFavorite={toggleFavorite}
                      handleAddToCart={handleAddToCart}
                      showSizes={showSizesOnSale}
                      setShowSizes={setShowSizesOnSale}
                      setIsOpenWishlistMessage={
                        setIsOpenWishlistMessage || undefined
                      }
                      index={index}
                    />
                  </motion.div>
                </SplideSlide>
              ))}
            </Splide>
          </motion.div>

          <motion.div
            ref={salesRef}
            className="hidden md:grid grid-cols-5 gap-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1, // Adjust the stagger delay as needed
                },
              },
            }}
            initial="hidden"
            animate={salesControls}
            transition={{ duration: 1, delay: 0.5 }} // Adjust the duration and delay values
          >
            {onSale?.map((product, index) => (
              <motion.div
                key={product._id}
                variants={{
                  hidden: { opacity: 0, y: 75 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8, delay: index * 0.2 }} // Adjust the delay for each card
              >
                <ProductCardHome
                  product={product}
                  userFavs={userFavs}
                  toggleFavorite={toggleFavorite}
                  handleAddToCart={handleAddToCart}
                  showSizes={showSizesOnSale}
                  setShowSizes={setShowSizesOnSale}
                  setIsOpenWishlistMessage={
                    setIsOpenWishlistMessage || undefined
                  }
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="md:w-[91%] w-[97%] md:h-[calc(100vh-4rem)] mt-[5rem] md:mt-0 md:flex items-center justify-center flex-col"
          initial={{ opacity: 0, x: -100 }} // Animación desde la izquierda
          animate={{ opacity: 1, x: 0 }} // Posición final y opacidad 1
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="w-full flex justify-between items-end">
            <motion.h2
              className="mt-12 mb-2 text-2xl font-semibold uppercase"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ type: "easeIn", duration: 0.8 }}
              viewport={{ once: true }}
            >
              New arrivals
            </motion.h2>
            <motion.div
              ref={newArrivalsViewAll}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: "easeIn", duration: 0.8 }}
              viewport={{ once: true }}
              animate={newArrivalsViewAllControls}
              className="mb-2 md:mb-1"
            >
              <Link
                href="/products?sort=newest"
                className="font-semibold underline text-sm"
              >
                View All
              </Link>
            </motion.div>
          </div>

          {/* mobile */}
          <motion.div
            ref={mobileNewArrivalsRef}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1, // Adjust the stagger delay as needed
                },
              },
            }}
            initial="hidden"
            animate={mobileNewArrivalsControls}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Splide
              options={{
                arrows: false,
                pagination: false,
                drag: "free",
                autoplay: true,
                rewind: true,
                interval: 4000,
                breakpoints: {
                  640: {
                    perPage: 2,
                    gap: "10px",
                  },
                },
              }}
              className="md:hidden"
            >
              {products?.map((product, index) => (
                <SplideSlide key={product._id}>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 75 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <ProductCardHome
                      product={product}
                      userFavs={userFavs}
                      toggleFavorite={toggleFavorite}
                      handleAddToCart={handleAddToCart}
                      showSizes={showSizes}
                      setShowSizes={setShowSizes}
                      setIsOpenWishlistMessage={
                        setIsOpenWishlistMessage || undefined
                      }
                      index={index}
                    />
                  </motion.div>
                </SplideSlide>
              ))}
            </Splide>
          </motion.div>

          <motion.div
            ref={newArrivalsRef}
            className="hidden md:grid grid-cols-5 gap-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1, // Adjust the stagger delay as needed
                },
              },
            }}
            initial="hidden"
            animate={newArrivalsControls}
            transition={{ duration: 1, delay: 0.5 }} // Adjust the duration and delay values
          >
            {products?.map((product, index) => (
              <motion.div
                key={product._id}
                variants={{
                  hidden: { opacity: 0, y: 75 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8, delay: index * 0.2 }} // Adjust the delay for each card
              >
                <ProductCardHome
                  product={product}
                  userFavs={userFavs}
                  toggleFavorite={toggleFavorite}
                  handleAddToCart={handleAddToCart}
                  showSizes={showSizes}
                  setShowSizes={setShowSizes}
                  setIsOpenWishlistMessage={
                    setIsOpenWishlistMessage || undefined
                  }
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const session = await getSession({ req });
  await connect();
  const [relatedProducts, favorites, populars, onSale] = await Promise.all([
    Product.find().sort({ createdAt: -1 }).limit(5),
    Favorite.find({ user: session?.user?.id })
      .populate("product", "-reviews")
      .select("product")
      .lean()
      .exec(),
    Product.find({ rating: 5 }).sort({ createdAt: -1 }).limit(5),
    Product.find({
      "discount.isActive": true,
    })
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  console.log("pop", populars);
  const favoriteProductIds = favorites?.map(
    (favorite: any) => favorite?.product?._id
  );

  return {
    props: {
      products: relatedProducts ? toJSON(relatedProducts) : null,
      favorites: favorites ? toJSON(favoriteProductIds) : null,
      populars: populars ? toJSON(populars) : null,
      onSale: onSale ? toJSON(onSale) : null,
    },
  };
}
