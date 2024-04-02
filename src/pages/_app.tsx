import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import { LazyMotion, domAnimation } from "framer-motion";
import Head from "next/head";
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
