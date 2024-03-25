import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import "~/styles/globals.css";
import Navbar from "../components/navbar/navbar";
import { LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      <Head>
        <title>66 Wordz</title>
        <meta name="66 wordz" content="Log in screen for 66 wordz" />
        <link rel="icon" href="/favicon.png" />{" "}
      </Head>
      <AnimatePresence>
        <LazyMotion features={domAnimation}>
          <div className="flex h-screen flex-col">
            {router.pathname !== "/login" && <Navbar key="navbar" />}
            <Component {...pageProps} />
          </div>
        </LazyMotion>
      </AnimatePresence>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
