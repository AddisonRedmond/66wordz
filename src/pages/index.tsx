import { useSession } from "next-auth/react";
import { AuthContext, authRequired } from "~/utils/authRequired";
import { AnimatePresence } from "framer-motion";
import { api } from "~/utils/api";
import Header from "~/components/hearder";
import { useEffect, useState } from "react";
import { GameType } from "@prisma/client";
import Survival from "~/components/survival/survival";
import GameCardV2 from "~/components/game-card-v2";
import crown from "../../public/crown.png";
import survival from "../../public/survival.png";
import CreateLobby from "~/components/create-lobby";
import JoinLobby from "~/components/join-lobby";
import { getRemaningGames } from "~/utils/game-limit";
import Elimination from "~/components/elimination/elimination";
import Navbar from "~/components/navbar/navbar";
import { useRouter } from "next/router";
import getStripe from "~/utils/get-stripejs";
import Modal from "~/components/modal";
import ChallengeCard from "~/components/challenge-card";

const Home = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/login");
    },
  });

  const quickPlay = api.quickPlay.quickPlay.useMutation();
  const lobby = api.createGame.getLobby.useQuery();
  const lobbyCleanUp = api.quickPlay.lobbyCleanUp.useMutation();
  const joinLobby = api.createGame.joinLobby.useMutation();
  const createLobby = api.createGame.createLobby.useMutation();
  const premiumUser = api.getUser.isPremiumUser.useQuery();
  const user = api.getUser.getUser.useQuery();

  const upgrade = api.upgrade.createCheckout.useMutation();

  const handleUpgrade = async () => {
    const checkoutURL = await upgrade.mutateAsync();
    const stripe = await getStripe();
    if (stripe !== null && checkoutURL) {
      await stripe.redirectToCheckout({ sessionId: checkoutURL });
    }
  };
  const [gameType, setGameType] = useState<GameType>("SURVIVAL");
  const [isCreateLobby, setIsCreateLobby] = useState<boolean>(false);
  const [isJoinLobby, setIsJoinLobby] = useState<boolean>(false);
  const [quitGame, setQuitGame] = useState<boolean>(false);

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
    setQuitGame(false);
    lobby.remove();
    user.refetch();
    // delete user from lobby db
    // delete user from firebase db
  };

  const handleCreateLobby = async (
    lobbyName: string,
    enableBots: boolean,
    gameType: GameType,
    passKey?: string,
  ) => {
    if (premiumUser.data?.isPremiumUser) {
      await createLobby.mutateAsync({
        lobbyName,
        passKey,
        enableBots,
        gameType,
      });
      lobby.refetch();
    }
  };

  const enableCreateLobby = (gameType: GameType) => {
    if (premiumUser.data?.isPremiumUser) {
      setIsCreateLobby(true);
      setGameType(gameType);
    }
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
              exitMatch={() => {
                setQuitGame(true);
              }}
            />
          );
        case "ELIMINATION":
          return (
            <Elimination
              lobbyId={lobby.data.id}
              userId={session!.user.id}
              gameType={lobby.data.gameType}
              exitMatch={() => {
                setQuitGame(true);
              }}
            />
          );
      }
    }
  };
  useEffect(() => {
    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave the game?";
    };

    if (lobby.data?.id) {
      window.addEventListener("beforeunload", beforeUnloadHandler);
    } else {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    }

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [lobby]);
  return (
    <div className="flex flex-grow flex-col">
      {quitGame && (
        <Modal>
          <div className="p-2">
            <h1 className="my-2 text-xl font-semibold">Leave Game</h1>
            <p className="my-2">Are you sure you want to leave?</p>
            <div className="my-2 flex justify-around font-medium">
              <button
                className="rounded-md bg-black p-2 text-white"
                onClick={() => exitMatch()}
              >
                Leave
              </button>
              <button
                className="rounded-md bg-[#9462C6] p-2 text-white"
                onClick={() => {
                  setQuitGame(false);
                }}
              >
                Stay
              </button>
            </div>
          </div>
        </Modal>
      )}
      <Navbar key="navbar" />
      <div className="flex min-w-[375px] flex-grow flex-col items-center justify-evenly pb-3">
        <Header
          isLoading={
            lobby.isLoading || quickPlay.isLoading || joinLobby.isLoading
          }
          desktopOnly={!!lobby.data?.id}
          isPremiumUser={premiumUser.data?.isPremiumUser}
        />
        <div className="flex flex-col gap-3">
          {!(isJoinLobby || isCreateLobby || lobby.data?.id) && (
            <div className="mb-5 flex flex-col justify-center">
              <p className="text-xl font-semibold">Join Custom Lobby</p>
              <button
                onClick={() => setIsJoinLobby(true)}
                className="rounded-full bg-black p-3 text-2xl font-semibold text-white duration-150 ease-in-out hover:bg-zinc-600"
              >
                Join Lobby
              </button>
            </div>
          )}
        </div>
        <AnimatePresence>
          {lobby.data?.id && session ? (
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
                <div className="flex flex-grow flex-wrap items-center justify-center gap-3">
                  <ChallengeCard />

                  <GameCardV2
                    gameType="ELIMINATION"
                    image={crown}
                    fullAccess={premiumUser.data?.isPremiumUser}
                    quickPlay={handleQuickPlay}
                    enableCreateLobby={enableCreateLobby}
                    handleUpgrade={handleUpgrade}
                    desc="Outplay your opponents in this round based game"
                  />
                  <GameCardV2
                    gameType="SURVIVAL"
                    image={survival}
                    fullAccess={premiumUser.data?.isPremiumUser}
                    quickPlay={handleQuickPlay}
                    enableCreateLobby={enableCreateLobby}
                    handleUpgrade={handleUpgrade}
                    desc="Offence is the best defence in this heated player vs player game"
                  />
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Home;

export async function getServerSideProps(context: AuthContext) {
  return await authRequired(context, false);
}
