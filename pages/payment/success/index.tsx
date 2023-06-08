import Layout from "@/components/layouts/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsCheckLg } from "react-icons/bs";

interface NotificationType {
  isOpen: boolean;
  type: "approved" | "failure" | null;
  content: string;
}

export default function SuccessPaymentScreen() {
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationType>({
    isOpen: false,
    type: null,
    content: "",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    if (status === "approved") {
      setNotification({
        content: "Pago aprobado!",
        isOpen: true,
        type: "approved",
      });

      localStorage.removeItem("cart");
    } else if (status === "failure") {
      setNotification({
        content: "Pago fallido!",
        isOpen: true,
        type: "failure",
      });
    }

    const notificationTimeout = setTimeout(() => {
      setNotification({
        isOpen: false,
        type: null,
        content: "",
      });
      router.push("/");
    }, 5000);

    return () => {
      clearTimeout(notificationTimeout);
    };
  }, []);

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] w-[95%] flex flex-col items-center pt-36 md:pt-28">
        <div className="h-20 w-20 bg-green-500 rounded-full text-white flex items-center justify-center mb-5">
          <BsCheckLg className="text-5xl" />
        </div>
        <h1 className="text-green-500 font-semibold text-3xl uppercase">
          Payment succesfull
        </h1>
        <div className="md:w-[30%] mb-3">
          <p className="text-center text-gray-600">
            You will be redirected to the home page shortly or click here to
            return to home page
          </p>
        </div>

        <Link href="/">
          <button className="bg-green-500 px-5 py-1 rounded text-white text-xl ">
            HOME
          </button>
        </Link>
      </section>
    </Layout>
  );
}

{
  /* <p className="text-center">
          You will be redirected to the home page shortly or click here to
          return to home page
        </p> */
}

export async function getServerSideProps(context: any) {
  // Aquí debes realizar la verificación del estado del pago en el servidor
  const { payment_id } = context.query;
  const mercadopago = require("mercadopago");

  // Configura la clave de acceso de Mercado Pago
  mercadopago.configure({
    access_token: process.env.NEXT_ACCESS_TOKEN,
  });

  async function checkPaymentStatus(paymentId: any) {
    try {
      // Realiza una consulta a la API de Mercado Pago para obtener el estado del pago
      const response = await mercadopago.payment.get(paymentId);
      const payment = response.body;

      // Verifica el estado del pago y devuelve true si es aprobado, de lo contrario, devuelve false
      return payment.status === "approved";
    } catch (error) {
      console.error("Error al verificar el estado del pago:", error);
      return false;
    }
  }

  const isPaymentSuccessful = await checkPaymentStatus(payment_id);

  if (!isPaymentSuccessful) {
    return {
      redirect: {
        destination: "/", // Redirige a una página de error
        permanent: false,
      },
    };
  }

  return {
    props: {}, // Devuelve las propiedades vacías si el pago es exitoso
  };
}
