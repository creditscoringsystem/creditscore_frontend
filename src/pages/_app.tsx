// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { M_PLUS_1 } from "next/font/google";

// Tích hợp font Google qua next/font (tối ưu hơn link thô)
const mplus1 = M_PLUS_1({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Nếu sau này cần meta, favicon,... thêm ở đây */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={mplus1.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
