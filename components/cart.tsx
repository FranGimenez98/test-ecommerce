// import db from "@/lib/db";
// import React from "react";
// import Cart from "@/models/Cart";
// import { GetServerSidePropsContext } from "next";
// import { getSession } from "next-auth/react";
// import { ICart } from "@/interfaces/ICart";
// import Product from "@/models/Product";

// interface CartProps {
//   cart: ICart | undefined;
// }

// export default function CartSideBar(cart: CartProps) {
//   console.log("CART", cart.cart);
 
//   return (
//     <div className="top-0 w-[90%] right-0 h-full bg-red-500 fixed">
//       <h1>CARRO</h1>
//       <div className=" flex flex-col items-center gap-3 h-full">
//       {
//         cart?.cart?.products?.map((item) => (
//           <div key={item._id}>
//             <p className="text-2xl">{item.product.name}</p>
//             <img className="h-[7rem] w-[7rem] object-cover bg-center " src={item.product.image}/>
//           </div>
//         ))
//       }
//       </div>
//     </div>
//   );
// }
