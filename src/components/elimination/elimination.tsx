import { GameType } from "@prisma/client";
import useEliminationData, {
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
import useSound from "use-sound";
import { handleCorrectGuess, handleIncorrectGuess } from "~/utils/elimination";
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

    if (!playerData || !gameData) {
      console.error("no player data");
      return;
    }
    if (!/[a-zA-Z]/.test(key)) {
      return;
    }

    const handleBackspace = () => {
      if (guess.length === 0) return;
      deleteSound();
      setGuess((prev) => prev.slice(0, -1));
    };

    const handleEnter = () => {
      if (guess === playerData.word) {
        // handle correct guess
        handleCorrectGuess(
          playerData,
          gameData.lobbyData.round,
          `${gameType}/${lobbyId}/players/${userId}`,
        );
      } else {
        // handle incorrect guess
        handleIncorrectGuess(
          guess,
          playerData,
          `${gameType}/${lobbyId}/players/${userId}`,
        );
      }

      setGuess("");
    };

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
        handleEnter();
        break;
      default:
        if (key.length === 1) {
          handleLetter(key);
        }
        break;
    }
  };

  useOnKeyUp(handleKeyUp, [guess, gameData]);

  const getHalfOfOpponents = (
    isEven: boolean,
    opponents?: EliminationPlayerData,
  ) => {
    if (!opponents) {
      return;
    }
    const filteredData: EliminationPlayerData = {};
    const keys = Object.keys(opponents);

    keys.forEach((key, index) => {
      if (opponents[key]) {
        if (isEven && index % 2 === 0) {
          filteredData[key] = opponents[key];
        } else if (!isEven && index % 2 !== 0) {
          filteredData[key] = opponents[key];
        }
      }
    });

    return filteredData;
  };

  return (
    <div className="flex w-screen flex-grow justify-around">
      {/* opponets left side */}
      <EliminationOpponent
        pointsGoal={gameData?.lobbyData.totalPoints}
        opponents={getHalfOfOpponents(true, gameData?.players)}
      />
      {/* hidden if game not started || if next round timer hasn't expired*/}
      <div className="flex w-1/4 min-w-80 flex-col items-center justify-center gap-y-8">
        <Round />
        <GameStatus />
        <WordContainer
          word={playerData?.word}
          match={playerData?.revealIndex}
        />
        <Points
          pointsGoal={gameData?.lobbyData.totalPoints}
          totalPoints={playerData?.points}
        />
        <div className="flex w-full flex-col gap-y-2">
          <GuessContainer word={guess} wordLength={playerData?.word.length} />
          <Keyboard
            disabled={false}
            handleKeyBoardLogic={handleKeyUp}
            matches={playerData?.matches}
          />
        </div>
      </div>
      <EliminationOpponent
        pointsGoal={gameData?.lobbyData.totalPoints}
        opponents={getHalfOfOpponents(false, gameData?.players)}
      />

      {/* opponents right side */}
    </div>
  );
};

export default Elimination;
