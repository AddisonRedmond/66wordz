import { GameType } from "@prisma/client";
import useEliminationData, {
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
import useSound from "use-sound";
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

  const playerData: EliminationPlayerObject | undefined =
    gameData?.players[userId];

  const [guess, setGuess] = useState("");

  const [popSound] = useSound("/sounds/pop-2.mp3", {
    volume: 0.5,
    playbackRate: 1.5,
  });

  const [deleteSound] = useSound("/sounds/delete2.mp3", {
    volume: 0.5,
    playbackRate: 3,
  });

  const handleKeyUp = (e: KeyboardEvent | string) => {
    const key = typeof e === "string" ? e.toUpperCase() : e.key.toUpperCase();
    if (!/[a-zA-Z]/.test(key)) {
      return;
    }

    const handleBackspace = () => {
      if (guess.length === 0) return;
      deleteSound();
      setGuess((prev) => prev.slice(0, -1));
    };

    const handleEnder = () => {};

    const handleLetter = (letter: string) => {
      if (guess.length < playerData?.word.length) {
        popSound();
        setGuess((prev) => prev + letter);
      }
    };

    switch (key) {
      case "BACKSPACE":
        handleBackspace();
        break;
      case "ENTER":
        console.log("enter");
        handleEnder();
        break;
      default:
        if (key.length === 1) {
          handleLetter(key);
        }
        break;
    }
  };

  useOnKeyUp(handleKeyUp, [guess]);

  return (
    <div className="flex w-screen flex-grow justify-around">
      {/* opponets left side */}
      {/* hidden if game not started || if next round timer hasn't expired*/}
      <div className="flex w-1/4 min-w-80 flex-col items-center justify-center gap-y-3">
        <Round />
        <WordContainer word={playerData?.word} match={[1, 3, 0]} />
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
