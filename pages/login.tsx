import React, { useState, useEffect } from "react";
import Layout from "../components/layouts/layout";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type LogInData = {
  email: string;
  password: string;
  repeatPassword: string;
};

export default function LoginScreen() {
  const [userError, setUserError] = useState(false);
  console.log(userError);

  const schema: ZodType<LogInData> = z
    .object({
      email: z.string().email(),
      password: z.string().min(5).max(20),
      repeatPassword: z.string().min(5).max(20),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: "Passwords do not match",
      path: ["repeatPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInData>({
    resolver: zodResolver(schema),
  });

  const submitData = async(data: LogInData) => {
    try {
      const user = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      
      if(!user?.ok){
        setUserError(true);
      }
    } catch (error) {
      setUserError(true);
    }
  };

  return (
    <Layout>
      <div className="w-[97%] min-h-[30rem] lg:w-[25%] bg-white shadow-md flex flex-col items-center">
        {/* <h2 className="text-lg font-semibold">Log in</h2> */}
        <form
          className="w-full flex flex-col items-center justify-center"
          onSubmit={handleSubmit(submitData)}
        >
          <div className="w-[70%] flex flex-col my-4">
            <label className="font-semibold text-slate-600">Email</label>
            <input
              placeholder="Pone tu email..."
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="w-[70%] flex flex-col mb-4">
            <label className="font-semibold text-slate-600">Password</label>
            <input
              placeholder="Pone tu contraseña..."
              type="password"
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="w-[70%] flex flex-col mb-4">
            <label className="font-semibold text-slate-600">
              Repeat password
            </label>
            <input
              placeholder="Pone tu contraseñaaa... "
              type="password"
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("repeatPassword")}
            />
            {errors.repeatPassword && (
              <span className="text-red-500 text-sm">
                {errors.repeatPassword.message}
              </span>
            )}
          </div>
          <div className="w-[70%] flex flex-col justify-center my-2">
            <button
              className="bg-black text-white text-center py-1 w-full font-semibold"
              type="submit"
            >
              Login
            </button>
            {userError && (
              <span className="text-red-500 text-sm">
                Error, user not found
              </span>
            )}
          </div>
          <div className="w-[70%] flex items-center justify-center">
            <h3 className="text-sm text-gray-500 font-semibold">
              New to out platform?{" "}
              <Link href="/signup">
                <span className="text-emerald-500">Sign Up</span>
              </Link>
            </h3>
          </div>
          <div className="w-[70%] flex items-center justify-center">
            <h3 className="text-sm">Or</h3>
          </div>
          <div className="w-[70%] flex items-center justify-between gap-3 mb-8">
            <button className="bg-blue-900 flex items-center justify-center w-full py-1 text-white font-semibold">
              Facebook
            </button>
            <button className="bg-red-500 flex items-center justify-center w-full py-1 text-white font-semibold">
              Google
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
