import { signIn } from "next-auth/react";
import Head from "next/head";
import Facebook from "../../public/Facebook.svg";
import Google from "../../public/Google.svg";
import Image from "next/image";
import Tile from "~/components/tile";
import { authRequired } from "~/utils/authRequired";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <motion.div exit={{ opacity: 0 }}>
      <Head>
        <title>66 Wordz</title>
        <meta name="66 wordz" content="Log in screen for 66 wordz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-row">
        <div className="flex h-screen w-1/2 flex-col items-center justify-center gap-4 bg-black">
          <Tile letters={"66"} auto={true} />
          <Tile letters="WORDZ" />
        </div>
        <div className="flex h-screen w-1/2 flex-col items-center justify-center gap-48 bg-white font-bold">
          <h1 className="text-[5vh]">Login With</h1>
          <div className="flex items-center gap-10">
            <Image
              src={Facebook}
              alt="facebook icon to login"
              className="cursor-pointer"
            />
            <p>or</p>
            <Image
              src={Google}
              onClick={()=>signIn().catch(console.error)}
              alt="google icon to login"
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export async function getServerSideProps(context: any) {
  return await authRequired(context, true);
}
