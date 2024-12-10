import { AppProps, type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import { LazyMotion, domAnimation } from "framer-motion";
import Head from "next/head";
const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider dynamic {...pageProps}>
      <Head>
        <title>66 Wordz</title>
        <meta name="66 wordz" content="66wordz the game" />
        <meta name="description" content="Battle royale word game. Play up to 66 players at a time" />
        <meta name="keywords" content="Battle royale, brain game, competitive, multiplayer" />
        <meta name="author" content="Addison Redmond" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />


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
