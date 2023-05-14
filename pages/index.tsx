import Hero from "@/components/hero";
import Layout from "@/components/layouts/layout";
import { IProduct } from "@/interfaces/IProduct";
import {connect} from "@/lib/db";
import toJSON from "@/lib/toJSON";
import Product from "@/models/Product";
import { useSession } from "next-auth/react";
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
            {products?.map((product, index) => (
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

const CACHE_DURATION = 60 * 60; // Duración en segundos de la caché

async function getProducts(): Promise<IProduct[]> {
  await connect()
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('name price image slug'); // Solo se devuelven los campos necesarios
  
  return products;
}

export async function getStaticProps() {
  const products = await getProducts(); // Se obtienen los productos
  return {
    props: {
      products: toJSON(products),
    },
    revalidate: CACHE_DURATION, // Se almacena en caché durante un tiempo determinado
  };
}