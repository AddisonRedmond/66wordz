import useGameLobbyData from "../custom-hooks/useGameLobbyData"; // Import your custom hook
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { db } from "~/utils/firebase/firebase";
import GameGrid from "./game-grid";
import { useState } from "react";
type EliminationProps = {
  lobbyId: string;
  userId: string;
  gameType: "MARATHON" | "ELIMINATION" | "ITEMS";
};

const Elimination: React.FC<EliminationProps> = (props: EliminationProps) => {
  const gameData = useGameLobbyData(db, props);
  const [guess, setGuess] = useState("");
  const handleKeyUp = () => {
    console.log("KEY UP");
  };

  useOnKeyUp(handleKeyUp, []);
  console.log(gameData)
  if (gameData) {
    console.log("GAME DATA!!!")
    const { gameStarted, word } = gameData.lobbyData;
    const guesses: string[] = gameData?.players || [""];
    return (
      <div className="text-black">
        <GameGrid
          guess={guess}
          guesses={guesses}
          word={word}
          disabled={false}
        />
      </div>
    );
  } else {
    return <p>Loading!</p>;
  }
};

export default Elimination;
