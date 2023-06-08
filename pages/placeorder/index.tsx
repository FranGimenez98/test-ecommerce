import Layout from "@/components/layouts/layout";
import CartContext from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

interface NotificationType {
  isOpen: boolean;
  type: "approved" | "failure" | null;
  content: string;
}

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(CartContext);
  const [url, setUrl] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  console.log("url", url);

  const requestBody = {
    // items: state?.cart.cartItems.map((item) => {
    //   return {
    //     title: item.name,
    //     description: "hola!",
    //     picture_url: item.image,
    //     unit_price: item.price,
    //     quantity: item.quantity,
    //   };
    // }),
    items: state?.cart?.cartItems,
    name: state.cart.userData.name,
    surname: state.cart.userData.surname,
    email: state.cart.userData.email,
    area_code: state.cart.userData.phone.area_code,
    phone_number: state.cart.userData.phone.number,
    dni_number: state.cart.userData.identification.number,
    zip_code: state.cart.userAddress.zip_code,
    street_name: state.cart.userAddress.street_name,
    street_number: state.cart.userAddress.street_number,
    floor: state.cart.userAddress.floor,
    apartment: state.cart.userAddress.apartment,
    city_name: state.cart.userAddress.city_name,
    state_name: state.cart.userAddress.state_name,
    userId: session?.user?.id,
    orderId: state.cart.orderId,
  };

  useEffect(() => {
    const generateLink = async () => {
      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        setUrl(data.url);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    generateLink();
  }, []); // dependencia vacía para que se ejecute solo una vez

  const totalCartPrice = state?.cart?.cartItems.reduce(
    (a, c) => a + c.quantity * c.price,
    0
  );

  return (
    <Layout>
      <div className="w-[95%] lg:w-[90%] mt-10 flex flex-col gap-3 min-h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-semibold uppercase">your order</h2>
        <div className="flex gap-7 flex-col lg:flex-row w-ful">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full lg:w-[65%] h-full gap-2 mb-5">
            {state?.cart?.cartItems?.map((product, index) => (
              <div
                key={index}
                className="flex gap-2 items-center justify-between w-full bg-white rounded-md p-2 shadow-lg relative h-[8rem]"
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={product.image}
                    className="h-[7rem] w-[7rem] object-cover bg-center rounded-md border-[1px] border-gray-200"
                  />
                  <div className="flex flex-col gap-1 w-[90%] lg:w-full">
                    <span className="text-lg text-gray-700">
                      {product.name}
                    </span>
                    <span>Size {product.size}</span>
                    <span>Quantity: {product.quantity}</span>
                    <span className="text-2xl font-bold">
                      ${product.price * product.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col w-full lg:w-[35%] bg-white py-2 px-9 rounded-sm shadow-lg h-[30rem]">
            <h2 className="uppercase font-semibold mb-2">Your info:</h2>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-col w-full">
                <div className="flex flex-col w-full">
                  <div className="flex gap-3 w-full">
                    <div className="flex flex-col w-[7rem]">
                      <h2 className="uppercase font-semibold">NAME</h2>
                      <p>{state?.cart?.userData.name}</p>
                    </div>
                    <div className="flex flex-col w-[7rem]">
                      <h2 className="uppercase font-semibold">SURNAME</h2>
                      <p>{state?.cart?.userData.surname}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <div className="flex flex-col">
                  <div className="flex gap-3">
                    <div className="flex flex-col w-[7rem]">
                      <h2 className="uppercase font-semibold">DNI</h2>
                      <p>{state?.cart?.userData.identification.number}</p>
                    </div>
                    <div className="flex flex-col w-[10rem]">
                      <h2 className="uppercase font-semibold">PHONE NUMBER</h2>
                      <p>{state?.cart?.userData.phone.number}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <div className="flex flex-col">
                  <div className="flex gap-3">
                    <div className="flex flex-col w-[7rem]">
                      <h2 className="uppercase font-semibold">STATE</h2>
                      <p>{state?.cart?.userAddress.state_name}</p>
                    </div>
                    <div className="flex flex-col w-[10rem]">
                      <h2 className="uppercase font-semibold">CITY</h2>
                      <p>{state?.cart?.userAddress.city_name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <div className="flex flex-col">
                  <div className="flex gap-3">
                    <div className="flex flex-col w-[7rem]">
                      <h2 className="uppercase font-semibold">Address</h2>
                      <p>{state?.cart?.userAddress.street_number}</p>
                    </div>
                    <div className="flex flex-col w-[7rem]">
                      <h2 className="uppercase font-semibold">Number</h2>
                      <p>{state?.cart?.userAddress.street_name}</p>
                    </div>
                    <div className="flex flex-col w-[7rem]">
                      <h2 className="uppercase font-semibold">zip code</h2>
                      <p>{state?.cart?.userAddress.zip_code}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <div className="flex flex-col">
                  <div className="flex gap-3">
                    <div className="flex flex-col w-[7rem]">
                      <h2 className="uppercase font-semibold">apartment</h2>
                      <p>{state?.cart?.userAddress.apartment}</p>
                    </div>
                    <div className="flex flex-col w-[7rem]">
                      <h2 className="uppercase font-semibold">floor</h2>
                      <p>{state?.cart?.userAddress.floor}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 h-[1px] mt-8 "></div>

            <div className="mt-2 mb-5">
              <h2 className="uppercase font-semibold text-xl">
                TOTAL: ${totalCartPrice}
              </h2>
            </div>

            {loading ? (
              <button
                className="bg-black text-white text-center py-1 w-full font-semibold mb-5"
                disabled
              >
                Loading
              </button>
            ) : (
              <a
                className="bg-black text-white text-center py-1 w-full font-semibold mb-5"
                href={`${url}`}
              >
                PLACE ORDER
              </a>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
