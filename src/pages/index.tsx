import { useSession } from "next-auth/react";
import { AuthContext, authRequired } from "~/utils/authRequired";
import { AnimatePresence, m } from "framer-motion";
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
import CreateLobby from "~/components/create-lobby";
import JoinLobby from "~/components/join-lobby";
const Home = () => {
  const { data: session } = useSession();
  const quickPlay = api.public.joinPublicGame.useMutation();
  const lobby = api.createGame.getLobby.useQuery();
  const lobbyCleanUp = api.public.lobbyCleanUp.useMutation();
  const joinLobby = api.createGame.joinLobby.useMutation();
  const createLobby = api.createGame.createLobby.useMutation();
  const user = api.getUser.isPremiumUser.useQuery();

  const [rules, setRules] = useState<{ [header: string]: string[] }>({});
  const [gameType, setGameType] = useState<GameType>("SURVIVAL");
  const [gameDescriptionOpen, setGameDescriptionOpen] =
    useState<boolean>(false);
  const [isCreateLobby, setIsCreateLobby] = useState<boolean>(false);
  const [isJoinLobby, setIsJoinLobby] = useState<boolean>(false);

  const handleQuickPlay = async (gameMode: GameType) => {
    await quickPlay.mutateAsync({ gameMode: gameMode });
    lobby.refetch();
  };

  const handleJoinLobby = async (lobbyId?: string, passKey?: string) => {
    if (!lobbyId) return alert("Please enter a lobby id");
    await joinLobby.mutateAsync({ lobbyId, passKey });
    lobby.refetch();
  };

  const exitMatch: () => void = async () => {
    await lobbyCleanUp.mutateAsync();
    lobby.remove();
    // delete user from lobby db
    // delete user from firebase db
  };

  const handleCreateLobby = async (
    lobbyName: string,
    enableBots: boolean,
    passKey?: string,
  ) => {
    await createLobby.mutateAsync({ lobbyName, passKey, enableBots });
    lobby.refetch();
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
    if (lobby.data) {
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
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen min-w-[375px] flex-col items-center justify-evenly"
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
            {isCreateLobby && (
              <CreateLobby
                setIsCreateLobby={setIsCreateLobby}
                handleCreateLobby={handleCreateLobby}
              />
            )}
            {isJoinLobby && (
              <JoinLobby
                errorMessage={joinLobby.data}
                setIsJoinLobby={setIsJoinLobby}
                handleJoinLobby={handleJoinLobby}
              />
            )}
            {isCreateLobby === false && isJoinLobby === false && (
              <GameCard
                gameType="SURVIVAL"
                gameAlt="skull and crossbones image"
                gameImage={SurvivalImage}
                quickPlay={handleQuickPlay}
                handleDescription={handleGameDescription}
                rules={survivalRules}
                setIsCreateLobby={setIsCreateLobby}
                setIsJoinLobby={setIsJoinLobby}
                isPremiumUser={user.data?.isPremiumUser}
              />
            )}
          </div>
        )}
      </AnimatePresence>
    </m.div>
  );
};
export default Home;

export async function getServerSideProps(context: AuthContext) {
  return await authRequired(context, false);
}
