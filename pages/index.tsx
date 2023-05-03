import Hero from "@/components/hero";
import Layout from "@/components/layouts/layout";
import { useSession } from "next-auth/react";
import Link from "next/link";

const products = [
  {
    name: "Campera de Jean",
    slug: "campera-de-jean",
  },
  {
    name: "Campera Brown",
    slug: "campera-brown",
  },
  {
    name: "Hoodie Black",
    slug: "hoodie-black",
  },
  {
    name: "Jean baggy",
    slug: "jean-baggy",
  },
  {
    name: "Sorongo Alfa/Omega",
    slug: "sorongo-alfa-omega",
  },
];

export default function Home() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <Layout>
      <section className="min-h-screen w-full flex flex-col items-center">
        <Hero />
        <div className="md:w-[97%] mt-5 w-full bg-white p-2 shadow-lg rounded-sm">
          <h2 className="my-2 text-2xl font-bold">Nuevos productos</h2>
          <div className="grid grid-cols-5 gap-4">
            {products.map((product, index) => (
              <Link href={`/products/${product.slug}`} key={index}>
                <div className="bg-green-500 h-[20rem]">{product.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
