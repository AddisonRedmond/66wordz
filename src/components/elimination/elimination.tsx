import { GameType } from "@prisma/client";
import useEliminationData, {
  EliminationLobbyData,
  EliminationPlayerData,
  EliminationPlayerObject,
} from "~/custom-hooks/useEliminationData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "../board-components/word-container";
import Points from "./points";
import GameStatus from "../board-components/game-status";
import GuessContainer from "../board-components/guess-container";
import Round from "./round-counter";
import Keyboard from "../board-components/keyboard";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useState } from "react";
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
}: EliminationProps) => {
  const gameData = useEliminationData(db, { lobbyId, gameType });

  const [guess, setGuess] = useState("");

  const handleKeyUp = (e: KeyboardEvent | string) => {
    const key = typeof e === "string" ? e.toUpperCase() : e.key.toUpperCase();
    console.log(key)
    if (key === "BACKSPACE") {
      setGuess("");
    } else {
      setGuess((prevGuess)=>`${prevGuess}${key}`);
    }
  };

  useOnKeyUp(handleKeyUp, []);

  return (
    <div className="flex w-screen flex-grow justify-around">
      {/* opponets left side */}
      {/* hidden if game not started || if next round timer hasn't expired*/}
      <div className="flex w-1/4 min-w-80 flex-col items-center justify-center gap-y-3">
        <Round />
        <WordContainer word="FROM" match={[1, 3, 0]} />
        <Points pointsGoal={8} totalPoints={1} />
        <GameStatus />

        <GuessContainer word={guess} wordLength={4} />
        <Keyboard disabled={false} handleKeyBoardLogic={handleKeyUp} />
      </div>
      {/* opponents right side */}
    </div>
  );
};

export default Elimination;
