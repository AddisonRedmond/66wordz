import { useSession } from "next-auth/react";
import Head from "next/head";
import { authRequired } from "~/utils/authRequired";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "~/utils/api";
import GameControls from "~/components/game-controls";
import Header from "~/components/hearder";
import PublicGame from "~/components/public-game";
import Elimination from "~/components/elimination";
import { useState } from "react";
const Home = () => {
  const { data: session } = useSession();
  const lobby = api.public.joinPublicGame.useMutation();
  const [gameMode, setGameMode] = useState<
    "MARATHON" | "ELIMINATION" | "ITEMS"
  >("MARATHON");
  const joinGame = () => {
    lobby.mutate(gameMode);
  };

  const exitMatch = () => {
    lobby.reset();
  };
  const handleStartGame = () => {
    if (lobby.data?.id) {
      if (lobby.data.gameType === "MARATHON") {
        return (
          <PublicGame
            lobbyId={lobby.data.id}
            userId={session!.user.id}
            gameType={lobby.data.gameType}
            exitMatch={exitMatch}
          />
        );
      } else if (lobby.data.gameType === "ELIMINATION") {
        return (
          <Elimination
            lobbyId={lobby.data.id}
            userId={session!.user.id}
            gameType={gameMode}
          />
        );
      }
    }
  };

  return (
    <>
      <Head>
        <title>66 Wordz</title>
        <meta name="66 wordz" content="Log in screen for 66 wordz" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex min-h-screen flex-col items-center justify-evenly"
      >
        <Header isLoading={lobby.isLoading} />
        <AnimatePresence>
          {lobby.data?.id ? (
            handleStartGame()
          ) : (
            <GameControls
              joinGame={joinGame}
              gameMode={gameMode}
              setGameMode={setGameMode}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
export default Home;

export async function getServerSideProps(context: any) {
  return await authRequired(context, false);
}
