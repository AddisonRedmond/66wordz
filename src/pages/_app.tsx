import { AppProps, type AppType } from "next/app";
import { ClerkProvider } from '@clerk/nextjs'

import { api } from "~/utils/api";
import "~/styles/globals.css";
import { LazyMotion, domAnimation } from "framer-motion";
import Head from "next/head";
const MyApp: AppType = ({
  Component,
  pageProps 
}: AppProps) => {
  return (
    <ClerkProvider  {...pageProps} >
      <Head>
        <title>66 Wordz</title>
        <meta name="66 wordz" content="Log in screen for 66 wordz" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <LazyMotion features={domAnimation}>
        <div className="flex h-screen flex-col">
        <Component {...pageProps} />
        </div>
      </LazyMotion>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
