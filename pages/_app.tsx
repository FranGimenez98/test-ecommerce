import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

const StoreProvider = dynamic(
  () => import("@/context/CartProvider").then((ctx) => ctx.default),
  { ssr: false }
);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <StoreProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </StoreProvider>
  );
}
