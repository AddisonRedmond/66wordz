import useGameLobbyData from "../custom-hooks/useGameLobbyData"; // Import your custom hook
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { db } from "~/utils/firebase/firebase";
import GameGrid from "./game-grid";
import { useState } from "react";
import { motion } from "framer-motion";
import Keyboard from "./keyboard";
import WordContainer from "~/elimination/word-container";
import {
  handleCorrectAnswer,
  handleCreateWordIndex,
} from "~/utils/elimination";
type EliminationProps = {
  lobbyId: string;
  userId: string;
  gameType: "MARATHON" | "ELIMINATION" | "ITEMS";
};

type Matches = {
  fullMatch: string[];
  partialMatch: string[];
  noMatch: string[];
};

const Elimination: React.FC<EliminationProps> = (props: EliminationProps) => {
  const gameData = useGameLobbyData(db, props);
  const [guess, setGuess] = useState("");
  const [matches, setMatches] = useState<Matches>({
    fullMatch: [],
    partialMatch: [],
    noMatch: [],
  });
  const [matchingIndex, setMatchingIndex] = useState<number[]>([]);
  console.log(gameData)
  const handleKeyUp = async (e: KeyboardEvent) => {
    const { gameStarted, word } = gameData.lobbyData;
    if (e.key === "Backspace" && guess.length > 0) {
      setGuess((prevGuess) => prevGuess.slice(0, -1));
    } else if (e.key === "Enter") {
      // check if guess matches word
      if (guess === word) {
        handleCorrectAnswer();
        return;
      }
      // if it doesnt, increment number of guesses,
      else if (guess !== word) {
        // highlight matching letters, highlight semi-matching letters
        setMatchingIndex(handleCreateWordIndex(guess, word, matchingIndex));
      }
    } else if (
      /[a-zA-Z]/.test(e.key) &&
      e.key.length === 1 &&
      guess.length < 5
    ) {
      setGuess((prevGuess) => `${prevGuess}${e.key}`.toUpperCase());
    }
  };

  useOnKeyUp(handleKeyUp, [guess, gameData]);
  if (gameData) {
    const { gameStarted, word } = gameData.lobbyData;
    const guesses: string[] = gameData?.players || [];
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="flex flex-col items-center justify-center gap-4"
      >
        <WordContainer word={word} matchingIndex={matchingIndex} />
        <GameGrid
          guess={guess}
          guesses={guesses}
          word={word}
          disabled={false}
          rows={1}
        />

        <Keyboard disabled={false} matches={matches} />
      </motion.div>
    );
  } else {
    return <p>Loading!</p>;
  }
};

export default Elimination;
