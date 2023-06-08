import Layout from "@/components/layouts/layout";
import Link from "next/link";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CartContext from "@/context/CartContext";
import { useContext } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';

export default function CheckoutScreen() {
  const { state, dispatch } = useContext(CartContext);
  const { data: session } = useSession();
  const router = useRouter()

  interface CheckOutData {
    name: string;
    surname: string;
    email: string;
    phone: string;
    dni: string;
    street_name: string;
    street_number: string;
    floor?: string | null;
    apartment?: string | null;
    city_name: string;
    state_name: string;
    zip_code: string;
  }

  const schema: ZodType<CheckOutData> = z.object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(15, { message: "Name must contain at most 15 character(s)" }),
    surname: z
      .string()
      .min(1, { message: "Surname is required" })
      .max(15, { message: "Surname must contain at most 15 character(s)" }),
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Must be a valid email",
    }),
    phone: z
      .string()
      .min(1, { message: "Phone is required" })
      .max(11)
      .regex(/^\d+$/, { message: "Phone must contain only digits" }),
    dni: z
      .string()
      .min(1, { message: "DNI is required" })
      .max(8)
      .regex(/^\d+$/, { message: "DNI must contain only digits" }),
    street_name: z
      .string()
      .min(1, { message: "Street name is required" })
      .max(20),
    street_number: z
      .string()
      .min(1, { message: "House number is required" })
      .max(10)
      .regex(/^\d+$/, { message: "Street number must contain only digits" }),
    floor: z
      .string()
      .max(100, { message: "Floor must contain at most 100 character(s)" })
      .regex(/^\d*$/, { message: "Floor must contain only digits" })
      .optional()
      .nullable(),
    apartment: z
      .string()
      .max(20, { message: "Apartment must contain at most 20 character(s)" })
      .nullish(),
    city_name: z
      .string()
      .min(1, { message: "City name is required" })
      .max(20, { message: "City name must contain at most 20 character(s)" }),
    state_name: z
      .string()
      .min(1, { message: "State name is required" })
      .max(20, { message: "State name must contain at most 20 character(s)" }),
    zip_code: z
      .string()
      .min(1, { message: "Zip code is required" })
      .max(5, { message: "Zip code must contain at most 5 character(s)" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckOutData>({
    resolver: zodResolver(schema),
  });

  const submitData = async (data: CheckOutData) => {
    dispatch({
      type: "SAVE_USER_DATA",
      payload: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: {
          // area_code: "11",
          number: parseInt(data.phone),
        },
        identification: {
          type: "DNI",
          number: data.dni,
        },
      },
    });

    dispatch({
      type: "SAVE_SHIPPING_ADRESS",
      payload: {
        zip_code: data.zip_code,
        street_name: data.street_name,
        street_number: parseInt(data.street_number),
        floor: data.floor && parseInt(data?.floor),
        apartment: data.apartment,
        city_name: data.city_name,
        state_name: data.state_name,
        country_name: "Argentina",
      },
    });

    const response = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: session?.user.id,
        orderItems: state.cart.cartItems.map((item) => ({
          product: item._id, // Assuming there's a productId field in the item
          name: item.name,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: 10,
      }),
    });
    const order = await response.json();
    dispatch({ type: "ADD_ORDER_ID", payload: { orderId: order._id } });
    router.push("/placeorder")
  };

  return (
    <Layout>
      <div className="w-[97%] md:w-[50%] mt-4">
        <h2 className="mt-12 mb-2 text-2xl font-semibold uppercase">
          Checkout
        </h2>
        <form
          className="w-full  flex flex-col items-center justify-center"
          onSubmit={handleSubmit(submitData)}
        >
          <div className="flex gap-2 justify-center items-center w-full">
            <div className=" flex flex-col w-full justify-center">
              <label>Nombre</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("name")}
              />
              <div className="h-[2.5rem] md:h-[2rem]">
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name?.message}
                  </span>
                )}
              </div>
            </div>

            <div className=" flex flex-col w-full justify-center">
              <label>Apellido</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("surname")}
              />

              <div className="h-[2.5rem] md:h-[2rem]">
                {errors.surname && (
                  <span className="text-red-500 text-sm">
                    {errors.surname?.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className=" flex flex-col w-full">
            <label>Email</label>
            <input
              type="text"
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("email")}
            />
            <div className="h-[2.5rem] md:h-[2rem]">
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-center items-center w-full">
            <div className=" flex flex-col w-full justify-center">
              <label>Telofono</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("phone")}
              />

              <div className="h-[2.5rem] md:h-[2rem]">
                {errors.phone && (
                  <span className="text-red-500 text-sm">
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>
            <div className=" flex flex-col w-full justify-center">
              <label>DNI</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("dni")}
              />
              <div className="h-[2.5rem] md:h-[2rem]">
                {errors.dni && (
                  <span className="text-red-500 text-sm">
                    {errors.dni.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className=" flex flex-col w-full"></div>

          <div className="flex gap-2 justify-center items-center w-full">
            <div className=" flex flex-col w-full">
              <label>Calle</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("street_name")}
              />
              <div className="h-[2.5rem] md:h-[2rem]">
                {errors.street_name && (
                  <span className="text-red-500 text-sm">
                    {errors.street_name.message}
                  </span>
                )}
              </div>
            </div>

            <div className=" flex flex-col w-full">
              <label>Numero</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("street_number")}
              />
              <div className="h-[2.5rem] md:h-[2rem]">
                {errors.street_number && (
                  <span className="text-red-500 text-sm">
                    {errors.street_number.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex gap-2 justify-center items-center">
            <div className="w-full flex flex-col justify-center h-full">
              <label>{`Apartamento, habitación, etc.`}</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("apartment")}
              />
              <div className="h-[2.5rem] md:h-[2rem]">
                {errors.apartment && (
                  <span className="text-red-500 text-sm">
                    {errors.apartment.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col w-[50%] items-center justify-center h-full">
              <div className="w-full flex flex-col justify-center">
                <label>Piso</label>
                <input
                  type="text"
                  className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                  {...register("floor")}
                />
                <div className="h-[2.5rem] md:h-[2rem]">
                  {errors.floor && (
                    <span className="text-red-500 text-sm">
                      {errors.floor.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className=" flex flex-col w-full">
            <label>Localidad/Ciudad</label>
            <input
              type="text"
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("city_name")}
            />
            <div className="h-[2.5rem] md:h-[2rem]">
              {errors.city_name && (
                <span className="text-red-500 text-sm">
                  {errors.city_name.message}
                </span>
              )}
            </div>
          </div>
          <div className=" flex flex-col w-full">
            <label>Provincia</label>
            <input
              type="text"
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("state_name")}
            />
            <div className="h-[2.5rem] md:h-[2rem]">
              {errors.state_name && (
                <span className="text-red-500 text-sm">
                  {errors.state_name.message}
                </span>
              )}
            </div>
          </div>

          <div className=" flex flex-col w-full">
            <label>Codigo postal</label>
            <input
              type="text"
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("zip_code")}
            />
            <div className="h-[2.5rem] md:h-[2rem]">
              {errors.zip_code && (
                <span className="text-red-500 text-sm">
                  {errors.zip_code.message}
                </span>
              )}
            </div>
          </div>

          <div className=" flex flex-col w-full my-8">
            <button
              className="bg-black text-white text-center py-1 w-full font-semibold text-xl uppercase"
              type="submit"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
