import Hero from "@/components/hero";
import Layout from "@/components/layouts/layout";
import { ICart } from "@/interfaces/ICart";
import { IProduct } from "@/interfaces/IProduct";
import db from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";

interface HomeProps {
  products: IProduct[];
}

export default function Home(props: HomeProps) {
  const { data: session } = useSession();

  const { products } = props;

  return (
    <Layout>
      <section className="min-h-screen w-full flex flex-col items-center">
        <Hero />
        <div className="md:w-[97%] mt-5 w-full bg-white p-2 shadow-lg rounded-sm">
          <h2 className="my-2 text-2xl font-bold">Nuevos productos</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {products.map((product, index) => (
              <Link href={`/products/${product.slug}`} key={index}>
                <img
                  src={product.image}
                  className="h-[15rem] object-cover bg-center"
                />
                <h2 className="text-lg text-center">{product.name}</h2>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  await db.connect();
  const products: IProduct[] | undefined = await Product.find().sort({ createdAt: -1 }).limit(10);
  console.log(products);
  await db.disconnect();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
