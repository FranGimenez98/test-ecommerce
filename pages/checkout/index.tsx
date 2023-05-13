import Layout from "@/components/layouts/layout";
import Link from "next/link";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CartContext from "@/context/CartContext";
import { useContext } from "react";

export default function CheckoutScreen() {
  const { state, dispatch } = useContext(CartContext);

  interface CheckOutData {
    name: string;
    surname: string;
    email: string;
    phone: string;
    dni: string;
    street_name: string;
    street_number: string;
    floor: string;
    apartment: string;
    city_name: string;
    state_name: string;
    zip_code: string;
  }

  const schema: ZodType<CheckOutData> = z.object({
    name: z.string().min(5).max(20),
    surname: z.string().min(5).max(20),
    email: z.string().email(),
    phone: z.string().min(5).max(11),
    dni: z.string().max(20),
    street_name: z.string().max(20),
    street_number: z.string().min(4).max(20),
    floor: z.string().min(5).max(20),
    apartment: z.string().min(5).max(20),
    city_name: z.string().min(5).max(20),
    state_name: z.string().min(5).max(20),
    zip_code: z.string().min(4),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckOutData>({
    resolver: zodResolver(schema),
  });

  const submitData = (data: CheckOutData) => {
 
    dispatch({
      type: "SAVE_USER_DATA",
      payload: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: {
          area_code: "11",
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
        floor: parseInt(data.floor),
        apartment: data.apartment,
        city_name: data.city_name,
        state_name: data.state_name,
        country_name: "Argentina",
      },
    });
  };

  return (
    <Layout>
      <div className="w-[90%] mt-5">
        <form
          className="w-full  flex flex-col items-center justify-center"
          onSubmit={handleSubmit(submitData)}
        >
          <div className="flex gap-2 justify-center items-center">
            <div className=" flex flex-col w-full">
              <label>Nombre</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name?.message}
                </span>
              )}
            </div>
            <div className=" flex flex-col w-full">
              <label>Apellido</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("surname")}
              />
            </div>
            {errors.surname && (
              <span className="text-red-500 text-sm">
                {errors.surname?.message}
              </span>
            )}
          </div>
          <div className=" flex flex-col w-full">
            <label>Email</label>
            <input
              type="text"
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex gap-2 justify-center items-center">
            <div className=" flex flex-col w-[30%]">
              <label>Code</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              />
            </div>
            <div className=" flex flex-col w-full">
              <label>Telofono</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <span className="text-red-500 text-sm">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className=" flex flex-col w-full">
            <label>DNI</label>
            <input
              type="text"
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("dni")}
            />
          </div>
          {errors.dni && (
            <span className="text-red-500 text-sm">{errors.dni.message}</span>
          )}
          <div className="flex gap-2 justify-center items-center">
            <div className=" flex flex-col w-full">
              <label>Calle</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("street_name")}
              />
            </div>
            {errors.street_name && (
              <span className="text-red-500 text-sm">
                {errors.street_name.message}
              </span>
            )}
            <div className=" flex flex-col w-full">
              <label>Numero</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("street_number")}
              />
            </div>
            {errors.street_number && (
              <span className="text-red-500 text-sm">
                {errors.street_number.message}
              </span>
            )}
          </div>
          <div className="w-full flex gap-2 justify-center items-center">
            <div className="w-full flex flex-col justify-center">
              <label>{`Apartamento, habitación, etc.`}</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("apartment")}
              />
            </div>
            {errors.apartment && (
              <span className="text-red-500 text-sm">
                {errors.apartment.message}
              </span>
            )}
            <div className=" flex flex-col w-[30%] items-center justify-center">
              <label>Piso</label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
                {...register("floor")}
              />
            </div>
            {errors.floor && (
              <span className="text-red-500 text-sm">
                {errors.floor.message}
              </span>
            )}
          </div>

          <div className=" flex flex-col w-full">
            <label>Localidad/Ciudad</label>
            <input
              type="text"
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("city_name")}
            />
          </div>
          {errors.city_name && (
            <span className="text-red-500 text-sm">
              {errors.city_name.message}
            </span>
          )}
          <div className=" flex flex-col w-full">
            <label>Provincia</label>
            <input
              type="text"
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("state_name")}
            />
          </div>
          {errors.state_name && (
            <span className="text-red-500 text-sm">
              {errors.state_name.message}
            </span>
          )}
          <div className=" flex flex-col w-full">
            <label>Codigo postal</label>
            <input
              type="text"
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("zip_code")}
            />
          </div>
          {errors.zip_code && (
            <span className="text-red-500 text-sm">
              {errors.zip_code.message}
            </span>
          )}
          <div className=" flex flex-col w-full my-4">
            <button
              className="bg-black text-white text-center py-1 w-full font-semibold"
              type="submit"
            >
              Confirmar
            </button>
            {/* <Link href="/placeorder" className="w-full">
              <button
                className="bg-black text-white text-center py-1 w-full font-semibold"
                type="submit"
              >
                Confirmar
              </button>
            </Link> */}
          </div>
        </form>
      </div>
    </Layout>
  );
}
