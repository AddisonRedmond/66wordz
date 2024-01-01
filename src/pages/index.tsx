import { useSession } from "next-auth/react";
import Head from "next/head";
import { AuthContext, authRequired } from "~/utils/authRequired";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "~/utils/api";
import GameControls from "~/components/game-controls";
import Header from "~/components/hearder";
import Marathon from "~/components/marathon";
import Elimination from "~/components/elimination";
import { useState } from "react";
const Home = () => {
  const { data: session } = useSession();
  const lobby = api.public.joinPublicGame.useMutation();
  const lobbyCleanUp = api.public.lobbyCleanUp.useMutation();
  const [isSolo, setIsSolo] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<
    "MARATHON" | "ELIMINATION" | "ITEMS"
  >("ELIMINATION");
  const joinGame = () => {
    lobby.mutate({ gameMode: gameMode, isSolo: true });
  };

  const exitMatch = () => {
    lobbyCleanUp.mutate();
    lobby.reset();
    // delete user from lobby db
    // delete user from firebase db
  };
  const handleStartGame = () => {
    if (lobby.data?.id) {
      if (lobby.data.gameType === "MARATHON") {
        return (
          <Marathon
            lobbyId={lobby.data.id}
            userId={session!.user.id}
            gameType={lobby.data.gameType}
            exitMatch={exitMatch}
            isSolo={isSolo}
          />
        );
      } else if (lobby.data.gameType === "ELIMINATION") {
        return (
          <Elimination
            lobbyId={lobby.data.id}
            userId={session!.user.id}
            gameType={gameMode}
            exitMatch={exitMatch}
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
        <Header isLoading={lobby.isLoading} desktopOnly={!!lobby.data?.id} />
        <AnimatePresence>
          {lobby.data?.id ? (
            handleStartGame()
          ) : (
            <GameControls
              joinGame={joinGame}
              gameMode={gameMode}
              setGameMode={setGameMode}
              setIsSolo={setIsSolo}
              isSolo={isSolo}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
export default Home;

export async function getServerSideProps(context: AuthContext) {
  return await authRequired(context, false);
}
