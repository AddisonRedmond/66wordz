import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { api } from "~/utils/api";
import Header from "~/components/hearder";
import React, { useEffect, useState } from "react";
import { GameType } from "@prisma/client";
import GameCardV2 from "~/components/game-card-v2";
import Navbar from "~/components/navbar/navbar";
import getStripe from "~/utils/get-stripejs";
import Modal from "~/components/modal";
import ChallengeCard from "~/components/challenge-card";

import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps, NextPage } from "next";
import toast, { Toaster } from "react-hot-toast";
import RejoinGame from "~/components/survival/rejoin-game";
import { useIsMobile } from "~/custom-hooks/useIsMobile";

const Elimination = dynamic(
  () => import("~/components/elimination/elimination"),
  {
    loading: () => <p>Loading game...</p>,
  },
);
const Race = dynamic(() => import("~/components/race/race"), {
  loading: () => <p>Loading game...</p>,
});
const Marathon = dynamic(() => import("~/components/marathon/marathon"), {
  loading: () => <p>Loading game...</p>,
});

const Home: NextPage<{ userId: string }> = ({ userId }) => {
  // TODO get rid of the lobby thing
  const quickPlay = api.quickPlay.quickPlay.useMutation();
  const lobby = api.createGame.getLobby.useQuery();
  const lobbyCleanUp = api.quickPlay.lobbyCleanUp.useMutation();
  const upgrade = api.upgrade.createCheckout.useMutation();
  const isMobile = useIsMobile();

  const rejoinGame = () => {
    toast.dismiss();
    quickPlay.mutate({ lobbyId: lobby.data?.id });
  };

  const declineRejoinGame = () => {
    exitMatch();
    toast.dismiss();
  };
  useEffect(() => {
    if (lobby.data && !quickPlay.data) {
      toast(<RejoinGame rejoin={rejoinGame} decline={declineRejoinGame} />, {
        duration: Infinity,
        id: "rejoin", // Ensure the toast ID is specified to avoid duplicates
        position: "bottom-right",
      });
    }
    // Cleanup: Optionally dismiss the toast when the component unmounts or dependencies change
    return () => {
      toast.dismiss("rejoin");
    };
  }, [lobby.data]); // Add necessary dependencies

  const handleUpgrade = async () => {
    const checkoutURL = await upgrade.mutateAsync();
    const stripe = await getStripe();
    if (stripe !== null && checkoutURL) {
      await stripe.redirectToCheckout({ sessionId: checkoutURL });
    }
  };
  const [quitGame, setQuitGame] = useState<boolean>(false);

  const handleQuickPlay = (gameMode: GameType) => {
    // TODO: Add detection for stale lobby
    toast.dismiss();
    quickPlay.mutate({ gameMode: gameMode });
  };

  const exitMatch = () => {
    quickPlay.reset();
    lobbyCleanUp.mutate();
    setQuitGame(false);
    // queryClient.removeQueries(lobby);
    // delete user from lobby db
    // delete user from firebase db
  };

  const handleStartGame = () => {
    if (quickPlay.data) {
      switch (quickPlay.data.gameType) {
        case "ELIMINATION":
          return (
            <Elimination
              lobbyId={quickPlay.data.id}
              userId={userId}
              gameType={quickPlay.data.gameType}
            />
          );
        case "RACE":
          return (
            <Race
              lobbyId={quickPlay.data.id}
              userId={userId}
              gameType={quickPlay.data.gameType}
            />
          );
        case "MARATHON":
          return (
            <Marathon
              lobbyId={quickPlay.data.id}
              userId={userId}
              gameType={quickPlay.data.gameType}
            />
          );
      }
    }
  };
  useEffect(() => {
    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    if (quickPlay.data?.id) {
      window.addEventListener("beforeunload", beforeUnloadHandler);
    } else {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    }

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [quickPlay]);
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
          isLoading={quickPlay.isPending}
          desktopOnly={!!quickPlay.data?.id}
        />

        <AnimatePresence>
          {quickPlay.data?.id ? (
            handleStartGame()
          ) : (
            <div className="flex w-full flex-grow grid-rows-2 flex-col items-center gap-y-4 md:grid">
              <ChallengeCard />
              <div className="flex flex-wrap items-center justify-center gap-3">
                <GameCardV2
                  gameType="ELIMINATION"
                  image={
                    "https://utfs.io/f/e8LGKadgGfdIPrp16cAFN2LzSnekdTxwXAr56uZhqvJ9jCiQ"
                  }
                  fullAccess={true}
                  quickPlay={handleQuickPlay}
                  handleUpgrade={handleUpgrade}
                  desc="Be the fastest to guess your words, in order to survive each round"
                />
                <GameCardV2
                  gameType="RACE"
                  image={
                    "https://utfs.io/f/e8LGKadgGfdIwrST4xRkSq6CTb0YOPGdeVulZgx4JU7HmWXL"
                  }
                  fullAccess={true}
                  quickPlay={handleQuickPlay}
                  handleUpgrade={handleUpgrade}
                  desc="Try to keep up with others to make it to the end"
                  disabled={isMobile}
                />
                <GameCardV2
                  gameType="MARATHON"
                  image={
                    "https://utfs.io/f/e8LGKadgGfdIEbAOC484OC5cU3GY6ZanoMtWuLQwsKVTzFJr"
                  }
                  fullAccess={true}
                  quickPlay={handleQuickPlay}
                  handleUpgrade={handleUpgrade}
                  desc="Guess words to outlast the competition"
                  disabled={isMobile}
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <footer className="m-auto pb-4">
        {quickPlay.data && (
          <button
            onClick={() => setQuitGame(true)}
            className="w-fit rounded-md bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700 sm:right-72 sm:top-2 sm:block"
          >
            LEAVE
          </button>
        )}
      </footer>
      <Toaster />
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
