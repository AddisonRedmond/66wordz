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
import Rules from "~/components/rules";
import { survivalRules } from "~/utils/survival/surivival";
import CreateLobby from "~/components/create-lobby";
import JoinLobby from "~/components/join-lobby";
import { getRemaningGames } from "~/utils/game-limit";
import EliminationImage from "../../public/elimination.png";
import Elimination from "~/components/elimination/elimination";
import Modal from "~/components/modal";
import Navbar from "~/components/navbar/navbar";
const Home = () => {
  const { data: session } = useSession();
  const quickPlay = api.public.joinPublicGame.useMutation();
  const lobby = api.createGame.getLobby.useQuery();
  const lobbyCleanUp = api.public.lobbyCleanUp.useMutation();
  const joinLobby = api.createGame.joinLobby.useMutation();
  const createLobby = api.createGame.createLobby.useMutation();
  const premiumUser = api.getUser.isPremiumUser.useQuery();
  const user = api.getUser.getUser.useQuery();

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
    user.refetch();
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

  const enableCreateLobby = (gameType: GameType) => {
    setIsCreateLobby(true);
    setGameType(gameType);
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
        case "ELIMINATION":
          return <Elimination />;
      }
    }
  };
  return (
    <>
      <Navbar key="navbar" />
      <div className="flex min-w-[375px] flex-grow flex-col items-center justify-evenly">
        <Header isLoading={lobby.isLoading} desktopOnly={!!lobby.data?.id} />
        <AnimatePresence>
          {lobby.data?.id ? (
            handleStartGame()
          ) : (
            <div className="flex flex-col flex-wrap items-center justify-center gap-2">
              {user.isSuccess &&
                user.data &&
                !premiumUser.data?.isPremiumUser && (
                  <p className="text-lg font-semibold">
                    {getRemaningGames(user.data)} free games remaning
                  </p>
                )}
              {gameDescriptionOpen && (
                <Modal>
                  <Rules
                    rules={rules}
                    gameType={gameType}
                    closeDescription={closeDescription}
                  />
                </Modal>
              )}
              {isCreateLobby && (
                <CreateLobby
                  setIsCreateLobby={setIsCreateLobby}
                  handleCreateLobby={handleCreateLobby}
                  gameType={gameType}
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
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <GameCard
                    gameType="SURVIVAL"
                    gameAlt="skull and crossbones image"
                    gameImage={SurvivalImage}
                    quickPlay={handleQuickPlay}
                    handleDescription={handleGameDescription}
                    rules={survivalRules}
                    enableCreateLobby={enableCreateLobby}
                    setIsJoinLobby={setIsJoinLobby}
                    isPremiumUser={premiumUser.data?.isPremiumUser}
                  />
                  <GameCard
                    gameType="ELIMINATION"
                    gameAlt="Elimination image"
                    gameImage={EliminationImage}
                    quickPlay={handleQuickPlay}
                    handleDescription={handleGameDescription}
                    rules={survivalRules}
                    enableCreateLobby={enableCreateLobby}
                    setIsJoinLobby={setIsJoinLobby}
                    isPremiumUser={premiumUser.data?.isPremiumUser}
                  />
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
export default Home;

export async function getServerSideProps(context: AuthContext) {
  return await authRequired(context, false);
}
