import React, { useState, useEffect } from "react";
import Layout from "../components/layouts/layout";
import { getSession, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { NextPageContext } from "next";

type LogInData = {
  email: string;
  password: string;
  repeatPassword: string;
};

export default function LoginScreen() {
  const [userError, setUserError] = useState(false);
  // const { data: session, status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (session?.user) {
  //     if(router.pathname === '/login' || router.pathname === '/signup') {
  //       router.push('/');
  //     }
  //   }
  // }, [session]);

  const schema: ZodType<LogInData> = z
    .object({
      email: z.string().email(),
      password: z
        .string()
        .min(6, { message: "Password must contain at least 6 character(s)" })
        .max(20),
      repeatPassword: z.string().min(6).max(20),
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

  const submitData = async (data: LogInData) => {
    const user = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (!user?.ok) {
      setUserError(true);
    } else {
      router.push("/");
    }
  };
  

  return (
    <Layout>
      <div className="w-[97%] my-[3rem] min-h-[30rem] lg:w-[25%] bg-white shadow-md flex flex-col items-center justify-center">
        <form
          className="w-full  flex flex-col items-center justify-center"
          onSubmit={handleSubmit(submitData)}
        >
          <div className="w-[70%] flex flex-col mt-4 mb-3">
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
          <div className="w-[70%] flex flex-col mb-3">
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
          <div className="w-[70%] flex flex-col">
            <label className="font-semibold text-slate-600">
              Repeat password
            </label>
            <input
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

          <div className="w-[70%] flex flex-col justify-center my-4">
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

          {/* <div className="w-[70%] flex items-center justify-between gap-3 mb-8">
            <button className="bg-blue-900 flex items-center justify-center w-full py-1 text-white font-semibold">
              Facebook
            </button>
            <button className="bg-red-500 flex items-center justify-center w-full py-1 text-white font-semibold">
              Google
            </button>
          </div> */}
        </form>
        <div className="w-[70%] flex items-center justify-center">
          <h3 className="text-sm text-gray-500 font-semibold">
            New to our platform?{" "}
            <Link href="/signup">
              <span className="text-emerald-500">Sign Up</span>
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

// export async function getServerSideProps(context: NextPageContext) {
//   const session = await getSession(context);
//   if (session && (context.req?.headers.cookie === "/login" || context.req?.headers.cookie === "/signup")) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }
//   return { props: {} };
// }