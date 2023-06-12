import Layout from "@/components/layouts/layout";
import { connect } from "@/lib/db";
import Favorite from "@/models/Favorite";
import React, { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import toJSON from "@/lib/toJSON";
import { BsSuitHeartFill } from "react-icons/bs";
import Link from "next/link";

interface FavoritesProps {
  favorites: any;
}

const FavoritesScreen = (props: FavoritesProps) => {
  const { favorites } = props;
  const { data: session } = useSession();
  const [userFavs, setUserFavs] = useState(favorites || []);

  const handleDeleteFav = async (productId: string) => {
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
      prevFavorites.filter((fav: any) => fav?.product?._id !== productId)
    );
  };

  const RenderNoSessionMessage = () => {
    return (
      <div className="w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold mt-[3rem] mb-[1.5rem]">
          🔒 SAVE TO WISHLIST
        </h2>
        <div className="w-[30%] text-center">
          <p className="text-gray-600">
            Login or create an account to view to your wishlist. We&apos;ll drop
            you back at your wishlist after you have entered your details.
          </p>
        </div>
        <div className="w-[30%] flex flex-col gap-4 mt-[3.5rem]">
          <Link href="/login" className="w-full">
            <button className="bg-gray-200 px-4 py-1 uppercase text-lg text-black font-semibold w-full">
              Login
            </button>
          </Link>
          <Link href="/signup" className="w-full">
            <button className="bg-black px-4 py-1 uppercase text-lg text-white font-semibold w-full">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Favorites">
      <section className="min-h-[calc(100vh-4rem)] mt-4 w-[97%] md:w-[90%]">
        {!session ? (
          <RenderNoSessionMessage />
        ) : (
          <div className="w-full">
            <h2 className="font-semibold text-xl uppercase mb-1 mt-5">
              Your Wishlist
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {userFavs.length > 0 ? (
                userFavs.map((fav: any) => (
                  <div
                    key={fav?._id}
                    className="bg-white w-[100%] md:w-[100%] h-[25rem] md:h-[100%] m-auto text-left relative"
                  >
                    <Link href={`/products/${fav?.product?.slug}`}>
                      <img
                        src={fav?.product?.images[0]}
                        alt={`${fav?.product.name} image`}
                        className="w-full h-[16rem] md:h-[20rem] m-auto mt-0 mb-0 object-cover bg-center"
                      />
                    </Link>
                    <h1 className="px-1 py-1 uppercase">{fav.product?.name}</h1>
                    {userFavs.some(
                      (item: any) => item?.product?._id === fav?.product?._id
                    ) && (
                      <button
                        className="absolute z-10 w-9 h-9 md:w-7 md:h-7 right-2 top-2 bg-white rounded-full flex items-center justify-center shadow-md"
                        onClick={() => handleDeleteFav(fav?.product?._id)}
                      >
                        <BsSuitHeartFill className="text-red-500" size="1rem" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-[20rem]">
                  <p>You have no favourites</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default FavoritesScreen;

export const getServerSideProps = async ({ req, res }: any) => {
  const session = await getSession({ req });
  await connect();

  const favorites: any = await Favorite.find({
    user: session?.user.id,
  }).populate("product");

  return {
    props: {
      favorites: favorites ? toJSON(favorites) : undefined,
    },
  };
};
