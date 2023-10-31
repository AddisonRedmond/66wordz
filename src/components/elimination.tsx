import useGameLobbyData from "../custom-hooks/useGameLobbyData"; // Import your custom hook
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { db } from "~/utils/firebase/firebase";
import GameGrid from "./game-grid";
import { useState } from "react";
import { motion } from "framer-motion";
import Keyboard from "./keyboard";
import WordContainer from "~/elimination/word-container";
type EliminationProps = {
  lobbyId: string;
  userId: string;
  gameType: "MARATHON" | "ELIMINATION" | "ITEMS";
};

const Elimination: React.FC<EliminationProps> = (props: EliminationProps) => {
  const gameData = useGameLobbyData(db, props);
  const [guess, setGuess] = useState("");

  const handleKeyUp = async (e: KeyboardEvent) => {
    console.log(e.key)
    if (/[a-zA-Z]/.test(e.key) && e.key.length === 1 && guess.length < 5) {
      setGuess((prevGuess) => `${prevGuess}${e.key}`.toUpperCase());
    }
  };

  console.log(guess)
  useOnKeyUp(handleKeyUp, []);
  if (gameData) {
    const { gameStarted, word } = gameData.lobbyData;
    const guesses: string[] = gameData?.players || [""];
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="flex flex-col items-center justify-center gap-4"
      >
        <WordContainer />
        <GameGrid
          guess={guess}
          guesses={guesses}
          word={word}
          disabled={false}
          rows={1}
        />

        <Keyboard
          disabled={false}
          matches={{
            fullMatch: [],
            partialMatch: [],
            noMatch: [],
          }}
        />
      </motion.div>
    );
  } else {
    return <p>Loading!</p>;
  }
};

export default Elimination;
