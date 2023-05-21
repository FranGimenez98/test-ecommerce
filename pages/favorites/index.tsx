import Layout from "@/components/layouts/layout";
import { connect } from "@/lib/db";
import Favorite from "@/models/Favorite";
import User from "@/models/User";
import React, { useState } from "react";
import { IUser } from "@/interfaces/IUser";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import toJSON from "@/lib/toJSON";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import Link from "next/link";

interface FavoritesProps {
  favorites: any;
  userId: string;
}

export default function FavoritesScreen(props: FavoritesProps) {
  const { favorites, userId } = props;
  const [userFavs, setUserFavs] = useState(favorites);
  console.log(userFavs);

  const handleDeleteFav = async (productId: string) => {
    await fetch(`/api/favorites/delete/${userId}?productId=${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setUserFavs((prevFavorites: any) =>
      prevFavorites.filter((fav: any) => fav.product._id !== productId)
    );
  };

  return (
    <Layout title="Favorites">
      <section className="min-h-screen mt-4">
        <div className="grid grid-cols-4 gap-4">
          {userFavs &&
            userFavs.map((fav: any) => (
              <div
                key={fav._id}
                className="bg-white w-[100%] md:w-[100%] h-[262px] md:h-[100%] m-auto hover:shadow-2xl shadow-lg text-left relative"
              >
                <Link href={`/products/${fav.product.slug}`}>
                  <img
                    src={fav.product.image}
                    className="w-[300px] h-[180px] md:h-[200px] m-auto mt-0 mb-0 object-cover bg-center"
                  />
                </Link>
                <h1>{fav.product.name}</h1>
                {userFavs.some(
                  (item: any) => item.product._id === fav.product._id
                ) && (
                  <button
                    className="absolute bottom-[90%] left-[85%] md:bottom-[92%] md:left-[90%]"
                    onClick={() => handleDeleteFav(fav.product._id)}
                  >
                    <BsSuitHeartFill className="text-red-500" size="1rem" />
                  </button>
                )}
              </div>
            ))}
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const session = await getSession({ req });
  const userEmail = session?.user.email;
  await connect();
  const user = (await User.findOne({ email: userEmail })
    .select("_id")
    .lean()
    .exec()) as IUser;
  const userId = user?._id.toString();
  const favorites: any = await Favorite.find({ user: userId }).populate(
    "product"
  );
  return {
    props: {
      userId: userId,
      favorites: toJSON(favorites),
    },
  };
};
