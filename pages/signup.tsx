import Layout from "@/components/layouts/layout";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import { BsFacebook } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { NextPageContext } from "next";

type SignUpData = {
  name: string;
  lastname: string;
  email: string;
  password: string;
};

export default function SignupScreen() {
  const [userError, setUserError] = useState(false);

  const schema: ZodType<SignUpData> = z.object({
    name: z.string().min(4).max(20),
    lastname: z.string().min(4).max(20),
    email: z.string().email(),
    password: z.string().min(6).max(20),
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
        setUserError(true);
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
      {/* <div className="w-[97%] lg:w-[25%] min-h-[30rem] my-[3rem] flex flex-col items-center"> */}
      <div className="w-[97%] lg:w-[25%] min-h-[30rem] my-[3rem] bg-white shadow-md flex flex-col items-center justify-center">
        {/* <h2 className="text-lg font-semibold">Sign up</h2> */}
        <form
          className="w-full flex flex-col items-center justify-center"
          onSubmit={handleSubmit(submitData)}
        >
          <div className="w-[70%] flex flex-col mt-4 mb-3">
            <label className="font-semibold text-slate-600">Name</label>
            <input
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="w-[70%] flex flex-col mb-3">
            <label className="font-semibold text-slate-600">Last name</label>
            <input
              className="w-full border-[1px] border-gray-200 rounded-md py-1 px-2 outline-none"
              {...register("lastname")}
            />
            {errors.lastname && (
              <span className="text-red-500 text-sm">
                {errors.lastname.message}
              </span>
            )}
          </div>
          <div className="w-[70%] flex flex-col mb-3">
            <label className="font-semibold text-slate-600">Email</label>
            <input
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
              Create account
            </button>
            {userError && (
              <span className="text-red-500 text-sm">
                Error, email is already registered, please use a new email
              </span>
            )}
          </div>
        </form>
        <div className="w-[70%] flex items-center justify-center">
          <h3 className="text-sm text-gray-500 font-medium">
            Already have and account?{" "}
            <Link href="/login">
              <span className="text-emerald-500">Log in</span>
            </Link>
          </h3>
        </div>
        <div className="w-[70%] flex items-center justify-center gap-3 my-3">
          <div className="bg-gray-300 w-full h-[1px]" />
          <h3 className="text-sm text-gray-500">Or</h3>
          <div className="bg-gray-300 w-full h-[1px]" />
        </div>
        <div className="w-[70%] flex flex-col items-center justify-between gap-3 mb-8">
          <button
            className="bg-[#fafafa]  border-[1px] border-gray-200 flex gap-2 items-center justify-center w-full py-1 text-gray-500 font-medium"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </button>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
