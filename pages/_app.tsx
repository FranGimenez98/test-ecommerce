import "@/styles/globals.css";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

const StoreProvider = dynamic(
  () => import("@/context/CartProvider").then((ctx) => ctx.default),
  { ssr: false }
);

const animations = {
  initial: {
    opacity: 0,
    y: 50,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.5,
      ease: "easeIn",
    },
  },
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  return (
    <>
      <NextNProgress options={{ easing: "ease", speed: 500 }} />
      <StoreProvider>
        <SessionProvider session={session}>
          <AnimatePresence mode="wait">
            <motion.div
              key={router.route}
              initial="initial"
              animate="enter"
              exit="exit"
              variants={animations}
            >
              {/* <ToastContainer
                position="bottom-right"
                autoClose={5000}
              /> */}
              <Toaster position="bottom-right" />
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </SessionProvider>
      </StoreProvider>
    </>
  );
}
