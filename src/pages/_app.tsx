import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import "~/styles/globals.css";
import Navbar from "../components/navbar/navbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      <AnimatePresence>
        {router.pathname !== "/login" && <Navbar key="navbar" />}
        <Component {...pageProps} />
      </AnimatePresence>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
