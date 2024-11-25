import { GameType } from "@prisma/client";
import { ref } from "firebase/database";
import useGameData from "~/custom-hooks/useGameData";
import { db } from "~/utils/firebase/firebase";
import {
  handleCorrectMarathonGuess,
  handleIncorrectMarathonGuess,
  MarathonGameData,
  MarathonPlayerData,
} from "~/utils/marathon";
import Keyboard from "../board-components/keyboard";
import WordContainer from "../board-components/word-container";
import GuessContainer from "../board-components/guess-container";
import LifeTimer from "./life-timer";
import MarathonOpponents from "./marathon-opponents";
import { useState } from "react";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { checkSpelling } from "~/utils/spellCheck";

type MarathonProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
};

const Marathon: React.FC<MarathonProps> = ({ lobbyId, userId, gameType }) => {
  const lobbyRef = ref(db, `${gameType}/${lobbyId}`);
  const gameData = useGameData<MarathonGameData>(lobbyRef);
  const playerData = gameData?.players?.[userId];
  const [guess, setGuess] = useState("");

  const handleKeyUp = (e: KeyboardEvent | string) => {
    const key = typeof e === "string" ? e.toUpperCase() : e.key.toUpperCase();

    // conditions to ensure the player should be guessing
    if (!playerData || !gameData) {
      console.error("no player data");
      return;
    } else if (playerData?.eliminated) {
      console.warn("player already qualified");
      return;
    } else if (!gameData.lobbyData.gameStarted) {
      console.warn("Game hasn't started yet");
      return;
    } else if (!/[a-zA-Z]/.test(key)) {
      return;
    } else if (gameData.lobbyData?.winner) {
      console.warn("Somebody already won");
      return;
    }

    const handleBackspace = () => {
      if (guess.length === 0) return;
      setGuess((prev) => prev.slice(0, -1));
    };

    const handleEnter = () => {
      // ensure guess length is same length as word
      if (guess.length === playerData.word.length) {
        // check if guess is correct
        if (!checkSpelling(guess)) {
          return;
        }
        if (guess === playerData.word) {
          // get current placement
          handleCorrectMarathonGuess(
            lobbyRef,
            userId,
            playerData,
            gameData.lobbyData.round,
          );
        } else {
          // handle incorrect guess
          handleIncorrectMarathonGuess(lobbyRef, userId, playerData, guess);
        }
        setGuess("");
      }
    };

    const handleLetter = (letter: string) => {
      if (guess.length < playerData?.word.length) {
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

  // if playerData is undefined and game started is true, error boundary

  // TODO: make a custom return function, that either returns an error like this or returns the component
  if ((gameData?.lobbyData.gameStarted && !playerData) || !gameData) {
    return <div>Something weird happened. I would leave and try again</div>;
  }

  const getHalfOfOpponents = () => {
    const fakeOpponent: Record<string, MarathonPlayerData> = {
      player1: {
        eliminated: false,
        correctGuessCount: 0,
        matches: { full: [], partial: [], none: [] },
        word: "CLEAR",
        initials: "ALR",
        incorrectGuessCount: 0,
      },
    };
    return fakeOpponent;
  };

  return (
    <div className="flex h-full w-full justify-evenly">
      <MarathonOpponents opponents={getHalfOfOpponents()} />
      <div className="flex h-full w-1/4 flex-col justify-center gap-4">
        {playerData?.lifeTimer && <LifeTimer endTime={playerData?.lifeTimer} />}
        <WordContainer word={playerData?.word} />
        <GuessContainer word={guess} wordLength={5} />
        <Keyboard
          matches={playerData?.matches}
          handleKeyBoardLogic={handleKeyUp}
          disabled={!gameData.lobbyData.gameStarted}
        />
      </div>
      <MarathonOpponents opponents={getHalfOfOpponents()} />
    </div>
  );
};

export default Marathon;
