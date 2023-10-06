import { useSession } from "next-auth/react";
import Head from "next/head";
import { authRequired } from "~/utils/authRequired";
import { motion } from "framer-motion";
import { api } from "~/utils/api";
import GameControls from "~/components/game-controls";
import Header from "~/components/hearder";
import PublicGame from "~/components/public-game";

const Home = () => {
  const { data } = useSession();
  const lobby = api.public.joinPublicGame.useMutation();

  const joinGame = () => {
    lobby.mutate();
  };

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
        className="flex min-h-screen flex-col items-center justify-around"
      >
        <Header isLoading={lobby.isLoading} />
        {lobby.data?.lobbyId ? (
          <PublicGame lobbyId={lobby.data.lobbyId} />
        ) : (
          <GameControls joinGame={joinGame} />
        )}
      </motion.div>
    </>
  );
};
export default Home;

export async function getServerSideProps(context: any) {
  return await authRequired(context, false);
}
