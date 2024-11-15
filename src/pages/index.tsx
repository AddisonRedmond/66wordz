import { AnimatePresence } from "framer-motion";
import { api } from "~/utils/api";
import Header from "~/components/hearder";
import React, { useEffect, useState } from "react";
import { GameType } from "@prisma/client";
import GameCardV2 from "~/components/game-card-v2";
import survival from "../../public/survival.png";
import Elimination from "~/components/elimination/elimination";
import Navbar from "~/components/navbar/navbar";
import getStripe from "~/utils/get-stripejs";
import Modal from "~/components/modal";
import ChallengeCard from "~/components/challenge-card";
import Race from "~/components/race/race";

import { useQueryClient } from "@tanstack/react-query";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import crown from "~/../public/crown.png";

const Home: React.FC<{ userId: string }> = ({ userId }) => {
  const quickPlay = api.quickPlay.quickPlay.useMutation();
  const lobby = api.createGame.getLobby.useQuery();
  const lobbyCleanUp = api.quickPlay.lobbyCleanUp.useMutation();
  const joinLobby = api.createGame.joinLobby.useMutation();
  const upgrade = api.upgrade.createCheckout.useMutation();
  const queryClient = useQueryClient();

  const handleUpgrade = async () => {
    const checkoutURL = await upgrade.mutateAsync();
    const stripe = await getStripe();
    if (stripe !== null && checkoutURL) {
      await stripe.redirectToCheckout({ sessionId: checkoutURL });
    }
  };
  const [quitGame, setQuitGame] = useState<boolean>(false);

  const handleQuickPlay = async (gameMode: GameType) => {
    // TODO: Add a do you want to rejoin previous game message
    // TODO: Add detection for stale lobby
    await quickPlay.mutateAsync({ gameMode: gameMode });
    lobby.refetch();
  };

  const exitMatch: () => void = async () => {
    await lobbyCleanUp.mutateAsync();
    setQuitGame(false);
    queryClient.removeQueries(lobby);
    // delete user from lobby db
    // delete user from firebase db
  };

  const handleStartGame = () => {
    if (lobby.data) {
      switch (lobby.data.gameType) {
        case "ELIMINATION":
          return (
            <Elimination
              lobbyId={lobby.data.id}
              userId={userId}
              gameType={lobby.data.gameType}
            />
          );
        case "RACE":
          return (
            <Race
              lobbyId={lobby.data.id}
              userId={userId}
              gameType={lobby.data.gameType}
            />
          );
      }
    }
  };
  useEffect(() => {
    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
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
            lobby.isLoading || quickPlay.isPending || joinLobby.isPending
          }
          desktopOnly={!!lobby.data?.id}
        />

        <AnimatePresence>
          {lobby.data?.id ? (
            handleStartGame()
          ) : (
            <div className="w flex flex-grow flex-wrap items-center justify-center gap-3">
              <ChallengeCard />

              <GameCardV2
                gameType="ELIMINATION"
                image={crown}
                fullAccess={true}
                quickPlay={handleQuickPlay}
                handleUpgrade={handleUpgrade}
                desc="Be the fastest to guess your words, in order to survive each round"
              />
              <GameCardV2
                gameType="RACE"
                image={survival}
                fullAccess={true}
                quickPlay={handleQuickPlay}
                handleUpgrade={handleUpgrade}
                desc="Guess words fast"
              />
            </div>
          )}
        </AnimatePresence>
      </div>
      <footer className="m-auto pb-4">
        {lobby.data && (
          <button
            onClick={() => setQuitGame(true)}
            className="w-fit rounded-md bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700 sm:right-72 sm:top-2 sm:block "
          >
            LEAVE
          </button>
        )}
      </footer>
    </div>
  );
};
export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    // send user to index
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: { userId } };
};
