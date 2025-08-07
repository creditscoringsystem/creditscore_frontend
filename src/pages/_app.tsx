// src/pages/_app.tsx

import '@/styles/globals.css';
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { SurveyProvider } from "@/contexts/SurveyContext";
import AppLayout from "@/components/ui/AppLayout";
import { Poppins, M_PLUS_1 } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});
const mplus1 = M_PLUS_1({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const isDashboard = pathname.startsWith('/dashboard');

  const content = <Component {...pageProps} />;

  return (
    <SurveyProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${mplus1.className} ${isDashboard ? '' : poppins.className}`}>  
        {isDashboard ? <AppLayout>{content}</AppLayout> : content}
      </main>
    </SurveyProvider>
  );
}
