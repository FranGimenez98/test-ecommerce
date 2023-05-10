import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <div className="bg-black w-full md:h-[25rem] h-[16rem] bg-[url('https://stylecaster.com/wp-content/uploads/2022/12/mensfashiontrends.png')] bg-cover bg-no-repeat bg-center bg-origin-padding">
      <div className="md:w-[235px] w-[235px] m-auto">
        <div className="flex flex-row md:justify-between justify-between items-center md:w-[100%] md:mt-[280px] mt-[150px]">
          <Link href="/products">
            <button className="bg-white text-black p-2 font-semibold mr-1">SHOP WOMEN</button>
            <button className="bg-white text-black p-2 font-semibold ml-1">SHOP MEN</button>
          </Link>
        </div>
        <div className="justify-center m-auto items-center md:mt-[10px] mt-[10px]">
          <button className="bg-white text-black p-2 font-semibold md:w-[100%] w-[100%]">VIEW ALL PRODUCTS</button>
        </div>
      </div>
    </div>
  );
}
