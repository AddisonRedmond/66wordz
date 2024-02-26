import { signIn } from "next-auth/react";
import Head from "next/head";
import Facebook from "../../public/Facebook.svg";
import Google from "../../public/Google.svg";
import Image from "next/image";
import Tile from "~/components/tile";
import { AuthContext, authRequired } from "~/utils/authRequired";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <motion.div exit={{ opacity: 0 }}>
      <Head>
        <title>66 Wordz</title>
        <meta name="66 wordz" content="Log in screen for 66 wordz" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="flex h-screen flex-col md:flex-row">
        <div className="flex h-1/2 flex-col items-center justify-center gap-4 bg-black md:h-full md:w-1/2">
          <Tile letters={"66"} />
          <Tile letters="WORDZ" />
        </div>
        <div className="flex h-1/2 flex-col items-center justify-center gap-48 bg-white font-bold md:h-full md:w-1/2">
          <div className="flex items-center gap-10">
            <button
              onClick={() => signIn()}
              className=" rounded-md border-2 border-[#9462C6] bg-black px-4 text-[4vh] text-white duration-150 ease-in-out hover:bg-zinc-700"
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export async function getServerSideProps(context: AuthContext) {
  return await authRequired(context, true);
}
