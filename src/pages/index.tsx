import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { authRequired } from "~/utils/authRequired";
import { motion } from "framer-motion";
import Tile from "~/components/tile";

const Home = () => {
  const { data } = useSession();
  return (
    <>
      <Head>
        <title>66 Wordz</title>
        <meta name="66 wordz" content="Log in screen for 66 wordz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex min-h-screen flex-col justify-around"
      >
        <div className="flex flex-col items-center gap-3">
          <Tile letters={"66"} />
          <Tile letters="WORDZ" />
        </div>
        <div className="flex flex-col items-center gap-4">
          <div>
            <button className="h-16 w-36 rounded-md bg-stone-500 px-4 font-semibold text-white duration-150 ease-in-out hover:bg-stone-400">
              Public Game
            </button>
          </div>
          <div>
            <button className="h-16 w-36 rounded-md border-2 border-black px-4 font-semibold duration-150 ease-in-out hover:bg-black hover:text-white">
              Ready
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
export default Home;

export async function getServerSideProps(context: any) {
  return await authRequired(context, false);
}
