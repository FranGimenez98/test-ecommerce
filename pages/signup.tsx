import Layout from "@/components/layouts/layout";
import Link from "next/link";
import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, SignInResponse } from "next-auth/react";

type SignUpData = {
  name: string;
  lastname: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

export default function SignupScreen() {

  const [userError, setUserError] = useState(false)

  const schema: ZodType<SignUpData> = z.object({
    name: z.string().min(4).max(20),
    lastname: z.string().min(4).max(20),
    email: z.string().email(),
    password: z.string().min(5).max(20),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({ resolver: zodResolver(schema) });

  const submitData = async (data: SignUpData) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setUserError(true)
        return;
      }

      await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error(error);
      console.log("Error:", error);
    }
  };

  return (
    <Layout>
      <div className="w-[97%] lg:w-[25%] min-h-[30rem] my-1 bg-white shadow-md flex flex-col items-center">
        {/* <h2 className="text-lg font-semibold">Sign up</h2> */}
        <form
          className="w-full flex flex-col items-center justify-center"
          onSubmit={handleSubmit(submitData)}
        >
          <div className="w-[70%] flex flex-col my-4">
            <label className="font-semibold text-slate-600">Name</label>
            <input
              placeholder="Pone tu email..."
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="w-[70%] flex flex-col mb-4">
            <label className="font-semibold text-slate-600">Last name</label>
            <input
              placeholder="Pone tu email..."
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("lastname")}
            />
            {errors.lastname && (
              <span className="text-red-500 text-sm">
                {errors.lastname.message}
              </span>
            )}
          </div>
          <div className="w-[70%] flex flex-col mb-4">
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
          <div className="w-[70%] flex flex-col ">
            <label className="font-semibold text-slate-600">Password</label>
            <input
              placeholder="Pone tu email..."
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
          
          <div className="w-[70%] flex flex-col justify-center my-4">
            <button
              className="bg-black text-white text-center py-1 w-full font-semibold"
              type="submit"
            >
              Sign up
            </button>
            {userError && <span className="text-red-500 text-sm">Error, email is already registered, please use a new email</span>}
          </div>
          <div className="w-[70%] flex items-center justify-center">
            <h3 className="text-sm text-gray-500 font-semibold">
              Already have and account?{" "}
              <Link href="/login">
                <span className="text-emerald-500">Log in</span>
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
