import Layout from "@/components/layouts/layout";
import React from "react";

export default function ProductsScreen() {
  return (
    <Layout>
      <div className="h-full w-full">
        <div className="md:w-[100%] mt-5 p-2">
          <div className="grid grid-cols-[300px_minmax(600px,_1fr)] gap-4 lg:gap-9 mr-8 ml-8">
            <div className="bg-white border border-dashed border-black border-2">
              <span>Filters</span>
            </div>
            <div className="grid grid-cols-[auto_auto] gap-5 md:grid-cols-[auto_auto_auto_auto] text-center">
              <div className="bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto hover:shadow-2xl flex flex-col">
                <img
                  src="https://www.segutecnica.com/images/000000000001757037365remera-naranja-segutecnica.png"
                  alt="products"
                  className="w-[200px] h-[200px] m-auto mt-[10px] mb-0"
                />
                <span className="fotn-bold text-lg mt-[20px]">
                  Remera Naranja
                </span>
                <span>
                  <b>7.999$</b>
                </span>
              </div>
              <div className="bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto hover:shadow-2xl">
                CARD
              </div>
              <div className="bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto hover:shadow-2xl">
                CARD
              </div>
              <div className="bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto hover:shadow-2xl">
                CARD
              </div>
              <div className="bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto hover:shadow-2xl">
                CARD
              </div>
              <div className="bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto hover:shadow-2xl">
                CARD
              </div>
              <div className="bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto hover:shadow-2xl">
                CARD
              </div>
              <div className="bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto hover:shadow-2xl">
                CARD
              </div>
            </div>
            {/* <div className='grid grid-cols-[250px_250px_250px] gap-10 md:grid-cols-[auto_auto_auto_auto]'>
                <div className='bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto'>CARD</div>
                <div className='bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto'>CARD</div>
                <div className='bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto'>CARD</div>
                <div className='bg-white border border-dashed border-black border-2 w-[15rem] h-[22rem] m-auto'>CARD</div>
              </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
