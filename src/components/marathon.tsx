import { useEffect, useState } from "react";
import {
  handleCorrectGuess,
  handleMatched,
  handleWordFailure,
} from "~/utils/game";
import { db } from "~/utils/firebase/firebase";
import words from "~/utils/dictionary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { api } from "~/utils/api";
import Confetti from "react-dom-confetti";
import useMarathonLobbyData from "../custom-hooks/useMarathonLobbyData";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import GameGrid from "./game-grid";
import Keyboard from "./keyboard";
type MarathonProps = {
  lobbyId: string;
  userId: string;
  gameType: "MARATHON" | "ELIMINATION" | "ITEMS";
  exitMatch: () => void;
};

type Matches = {
  fullMatch: string[];
  partialMatch: string[];
  noMatch: string[];
};

const Marathon: React.FC<MarathonProps> = (props: MarathonProps) => {
  const [guess, setGuess] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [win, setWin] = useState<boolean>(false);
  const [spectate, setSpectate] = useState<boolean>(false);
  const [endGameSummary, setEndGameSummary] = useState<{
    placement: number;
    totalTime: string;
    totalGuesses: number;
  } | null>(null);

  const endGame = api.public.endGame.useMutation();
  const manualStart = api.public.manualStart.useMutation();
  const gameData = useMarathonLobbyData(db, props);

  const [matches, setMatches] = useState<Matches>({
    fullMatch: [],
    partialMatch: [],
    noMatch: [],
  });

  const resetMatches = () => {
    setMatches({
      fullMatch: [],
      partialMatch: [],
      noMatch: [],
    });
  };

  const handleEndMatch = (firstPlace?: boolean) => {};

  const notify = () => toast.warn(`${guess} not in word list!`);

  const playerHasWon = () => {
    setWin(true);
    handleEndMatch(true);
  };

  const checkIfWin = () => {};

  const handleKeyBoardLogic = (letter: string) => {};
  const handleKeyUp = (e: KeyboardEvent) => {
    const letter = e.key.toUpperCase();
    handleKeyBoardLogic(letter);
  };

  useOnKeyUp(handleKeyUp, [guess, gameData]);

  console.log(gameData);

  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  if (gameData) {
    return (
      <>
        <Confetti active={win} config={config} />
        <motion.div
          exit={{ scale: 0 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex w-full items-center justify-around"
        >
          <div className="absolute left-10 top-24">
            <button
              onClick={() => props.exitMatch()}
              className="rounded-md border-2 border-black p-2 text-xs font-semibold text-black duration-150 ease-in-out hover:bg-black hover:text-white"
            >
              {gameData.lobbyData.gameStarted ? "Forfeit" : "Exit Match"}
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <GameGrid
              disabled={!gameData.lobbyData.gameStarted}
              guess={guess}
              guesses={[]}
              word={"TESTS"}
              rows={6}
            />
            <Keyboard
              matches={matches}
              disabled={!gameData.lobbyData.gameStarted}
            />
          </div>
        </motion.div>
        <ToastContainer
          position="bottom-center"
          autoClose={1000}
          limit={3}
          newestOnTop={false}
          theme="dark"
        />
      </>
    );
  } else {
    return <p>Loading!</p>;
  }
};

export default Marathon;
