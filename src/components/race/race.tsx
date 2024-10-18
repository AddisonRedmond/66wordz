import { GameType } from "@prisma/client";
import { ref } from "firebase/database";
import useGameData from "~/custom-hooks/useGameData";
import { db } from "~/utils/firebase/firebase";
import {
  RaceGameData,
  handleCorrectGuess,
  handleIncorrectGuess,
} from "~/utils/race";
import GuessContainer from "../board-components/guess-container";
import WordContainer from "../board-components/word-container";
import Keyboard from "../keyboard";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useState } from "react";
import { checkSpelling } from "~/utils/spellCheck";
import GameInfo from "./game-info";

type RaceProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
};

const Race: React.FC<RaceProps> = ({ lobbyId, userId, gameType }) => {
  const lobbyRef = ref(db, `${gameType}/${lobbyId}`);
  const gameData = useGameData<RaceGameData>(lobbyRef);
  const [spellCheck, setSpellCheck] = useState(false);
  const [guess, setGuess] = useState("");

  const playerData = gameData?.players[userId];

  const handleKeyUp = (e: KeyboardEvent | string) => {
    const key = typeof e === "string" ? e.toUpperCase() : e.key.toUpperCase();
    // only run function if player isn't eliminated and if they dont have full points

    console.log(key);
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
          setSpellCheck(true);

          return;
        }
        if (guess === playerData.word) {
          // get current placement
          handleCorrectGuess();
        } else {
          // handle incorrect guess
          handleIncorrectGuess();
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

  if (gameData) {
    return (
      <div className="flex w-full flex-grow justify-center">
        {/* opponesnts left */}
        <div className="w-1/3"></div>
        {/* main content */}
        <div className="flex w-11/12 min-w-80 flex-col items-center justify-center gap-y-3 sm:w-1/4 sm:gap-y-8">
          {/* make the info portion into its own component */}
          <GameInfo />
          <div className="flex w-full flex-col gap-y-2">
            <WordContainer word="WORDS" />
            <GuessContainer word={guess} wordLength={5} />
            <Keyboard disabled={false} handleKeyBoardLogic={handleKeyUp} />
          </div>
        </div>
        <div className="w-1/3"></div>
      </div>
    );
  }
};

export default Race;
