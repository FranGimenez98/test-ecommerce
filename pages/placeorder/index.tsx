import Layout from "@/components/layouts/layout";
import CartContext from "@/context/CartContext";
import { useContext, useEffect } from "react";

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(CartContext);

  const requestBody = {
    items: state?.cart.cartItems.map((item) => {
      return {
        title: item.name,
        description: "hola!",
        picture_url: item.image,
        unit_price: item.price,
        quantity: item.quantity,
      };
    }),
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
        console.log(data.url); // muestra la respuesta del servidor en la consola del navegador
      } catch (error) {
        console.error(error);
      }
    };

    generateLink();
  }, []); // dependencia vacía para que se ejecute solo una vez

  return (
    <Layout>
      <div className="w-[95%] lg:w-[50%] mt-5 flex flex-col gap-3">
        {state?.cart?.cartItems?.map((product, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between w-full h-full bg-white rounded-md p-2 shadow-lg relative"
          >
            <div className="flex gap-2 items-center">
              <img
                src={product.image}
                className="h-[7rem] w-[7rem] object-cover bg-center rounded-md border-[1px] border-gray-200"
              />
              <div className="flex flex-col gap-1 w-[50%] lg:w-full">
                <span className="text-lg text-gray-700">{product.name}</span>
                <span>Size {product.size}</span>
                <span className="text-2xl font-bold">
                  ${product.price * product.quantity}
                </span>
              </div>
            </div>
            <div className="bg-gray-200 h-full flex flex-col rounded-md">
              <button
                className="py-1 px-2 text-xl font-bold rounded-md"
                disabled={product.quantity >= product.stock}
              >
                +
              </button>
              <span className="py-1 px-2 text-lg font-semibold">
                {product.quantity}
              </span>
              <button
                className="py-1 px-2 text-lg font-bold rounded-md"
                disabled={product.quantity === 0}
              >
                -
              </button>
            </div>
          </div>
        ))}
        <div className="flex flex-col w-full">
          <div className="flex gap-2">
            <h2>{state?.cart?.userData.name}</h2>
            <h2>{state?.cart?.userData.surname}</h2>
          </div>
          <div className="flex gap-2">
            <h2>{state?.cart?.userData.identification.number}</h2>
            <h2>{state?.cart?.userData.phone.number}</h2>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-2">
            <h2>{state?.cart?.userAddress.state_name}</h2>
            <h2>{state?.cart?.userAddress.city_name}</h2>
          </div>
          <div className="flex gap-2">
            <h2>{state?.cart?.userAddress.street_name}</h2>
            <h2>{state?.cart?.userAddress.street_number}</h2>
            <h2>{state?.cart?.userAddress.zip_code}</h2>
          </div>
          <div className="flex gap-2">
            <h2>{state?.cart?.userAddress.apartment}</h2>
            <h2>{state?.cart?.userAddress.floor}</h2>
          </div>
        </div>
        <button
          className="bg-black text-white text-center py-1 w-full font-semibold"
          type="submit"
        >
          PLACE ORDER
        </button>
      </div>
    </Layout>
  );
}
