import { useSession } from "next-auth/react";
import Head from "next/head";
import { AuthContext, authRequired } from "~/utils/authRequired";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "~/utils/api";
import Header from "~/components/hearder";
import { useState } from "react";
import { GameType } from "@prisma/client";
import Survival from "~/components/survival/survival";
import GameCard from "~/components/game-card";
import SurvivalImage from "../../public/survival.svg";
import EliminationModal from "~/elimination/elimination-modal";
import Rules from "~/components/rules";
import { survivalRules } from "~/utils/survival/surivival";

const Home = () => {
  const { data: session } = useSession();
  const lobby = api.public.joinPublicGame.useMutation();
  const lobbyCleanUp = api.public.lobbyCleanUp.useMutation();
  const [rules, setRules] = useState<{ [header: string]: string[] }>({});
  const [gameType, setGameType] = useState<GameType>("SURVIVAL");
  const joinGame = (gameMode: GameType) => {
    lobby.mutate({ gameMode: gameMode });
  };
  const [gameDescriptionOpen, setGameDescriptionOpen] =
    useState<boolean>(false);

  const exitMatch: () => void = () => {
    lobbyCleanUp.mutate();
    lobby.reset();
    // delete user from lobby db
    // delete user from firebase db
  };

  const handleGameDescription = (gameType: GameType) => {
    setRules(survivalRules);
    setGameType(gameType);
    setGameDescriptionOpen(true);
  };

  const closeDescription = () => {
    setGameDescriptionOpen(false);
  };

  const handleStartGame = () => {
    if (lobby.data?.id) {
      switch (lobby.data.gameType) {
        case "SURVIVAL":
          return (
            <Survival
              lobbyId={lobby.data.id}
              userId={session!.user.id}
              gameType={lobby.data.gameType}
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
            <div className="flex flex-wrap justify-center gap-2">
              {gameDescriptionOpen && (
                <EliminationModal>
                  <Rules
                    rules={rules}
                    gameType={gameType}
                    closeDescription={closeDescription}
                  />
                </EliminationModal>
              )}
              <GameCard
                gameType="SURVIVAL"
                gameAlt="sword image"
                gameImage={SurvivalImage}
                joinGame={joinGame}
                handleDescription={handleGameDescription}
                rules={survivalRules}
              />
            </div>
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
