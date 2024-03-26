import { GameType } from "@prisma/client";
import useEliminationData from "~/custom-hooks/useEliminationData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "./word-container";
import GuessContainer from "./guess-container";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useState } from "react";
import PointsContainer from "./points-container";
type EliminationProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
  exitMatch: () => void;
};

const Elimination: React.FC<EliminationProps> = ({
  lobbyId,
  userId,
  gameType,
  exitMatch,
  ...props
}: EliminationProps) => {
  const gameData = useEliminationData(db, { userId, lobbyId, gameType });
  const playerData = gameData?.players[userId];
  const [guess, setGuess] = useState<string>("");

  const handleKeyBoardLogic = (event: any) => {
    //
    if (event.key === "Backspace") {
      setGuess((prev) => prev.slice(0, -1));
    } else if (event.key === "Enter") {
      setGuess("");
    } else if (event.key.length === 1) {
      setGuess((prev) => prev + event.key);
    }
  };
  useOnKeyUp(handleKeyBoardLogic, [guess, gameData]);

  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      {/* word to guess */}

      <div className="flex h-1/4 flex-col justify-between">
        {/* game details n stuff */}
        <WordContainer word="HELLO" revealIndex={playerData?.revealIndex} />

        {/* points */}
        {/* word youre guessing input*/}
        <div>
          <PointsContainer points={playerData?.points ?? 0} pointsGoal={300} />
          <GuessContainer guess={guess} />
        </div>

        {/* keyboard */}

        {/* opponents */}
      </div>

      <button
        onClick={() => exitMatch()}
        className="rounded-md bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700 sm:right-72 sm:top-2 sm:block "
      >
        QUIT
      </button>
    </div>
  );
};

export default Elimination;
