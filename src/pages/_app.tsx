import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { M_PLUS_1 } from "next/font/google";

// Tích hợp font Google
const mplus1 = M_PLUS_1({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={mplus1.className}>
      <Component {...pageProps} />
    </main>
  );
}
