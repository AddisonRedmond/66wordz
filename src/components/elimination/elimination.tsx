import { GameType } from "@prisma/client";
import useEliminationData from "~/custom-hooks/useEliminationData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "./word-container";
import GuessContainer from "./guess-container";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useState } from "react";
import PointsContainer from "./points-container";
import Keyboard from "../keyboard";
import EliminationOpponent from "./elimination-opponent";
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
  const players = gameData?.players;
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
    <div className="flex w-screen flex-grow justify-center">
      <div className="flex w-1/3 flex-wrap justify-around gap-3 gap-x-1 gap-y-2 overflow-hidden">
        {players &&
          Object.keys(Array.from({ length: 33 })).map(
            (playerId: string, index: number) => {
              return <EliminationOpponent key={index} opponentCount={33} />;
            },
          )}
      </div>
      <div className="flex flex-col items-center justify-center w-1/3">
        {/* word to guess */}
        <div className="flex h-1/2 flex-col justify-evenly">
          <WordContainer word="HELLO" revealIndex={playerData?.revealIndex} />
          {/* game details n stuff */}
          {/* points */}
          {/* word youre guessing input*/}
          <div className="flex flex-col gap-2">
            <PointsContainer
              points={playerData?.points ?? 0}
              pointsGoal={300}
            />
            <GuessContainer guess={guess} />
          </div>
          {/* keyboard */}
          {/* opponents */}
        </div>
        <Keyboard disabled={false} handleKeyBoardLogic={handleKeyBoardLogic} />
        <button
          onClick={() => exitMatch()}
          className="rounded-md bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700 sm:right-72 sm:top-2 sm:block "
        >
          QUIT
        </button>
      </div>
      <div className="flex w-1/3 flex-wrap justify-around gap-3 gap-x-1 gap-y-2 overflow-hidden">
        {players &&
          Object.keys(Array.from({ length: 33 })).map(
            (playerId: string, index: number) => {
              return <EliminationOpponent key={index} opponentCount={33} />;
            },
          )}
      </div>
    </div>
  );
};

export default Elimination;
