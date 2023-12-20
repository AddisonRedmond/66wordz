import { GameType } from "@prisma/client";
import useSurvialData from "../../custom-hooks/useSurvivalData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "./word-container";
import Keyboard from "../keyboard";
import Tile from "./tile";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import shield from "../../../public/shield.svg";
import health from "../../../public/health.svg";
import StatusBar from "./status-bar";

import Image from "next/image";
import StrikeTimer from "./strike-timer";
type SurvivalProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
  exitMatch: () => void;
};

const Survival: React.FC<SurvivalProps> = ({
  lobbyId,
  userId,
  gameType,
  exitMatch,
}: SurvivalProps) => {
  const gameData = useSurvialData(db, { userId, lobbyId, gameType });
  const [guess, setGuess] = useState<string>("");

  const handleKeyBoardLogic = (key: string) => {
    const words = Object.keys(gameData?.words || []);
    console.log(words);
    if (key === "Backspace" && guess.length > 0) {
      setGuess((prevGuess) => prevGuess.slice(0, -1));
    } else if (key === "Enter") {
      // check if guess matches any of the words
      if (words.includes(guess)) {
        // handle correct guess
      } else {
        // handle incorrect guess
        // reset guess
        // animation
      }
      //   if it doesn't run the sakey animation
    } else if (/[a-zA-Z]/.test(key) && key.length === 1 && guess.length < 6) {
      setGuess((prevGuess) => `${prevGuess}${key}`.toUpperCase());
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    handleKeyBoardLogic(e.key);
  };
  useOnKeyUp(handleKeyUp, [guess, gameData]);

  const playerData = gameData?.players[userId];
  return (
    <div className="flex flex-col items-center justify-around gap-12">
      {/* div for game info */}
      <div>
        <StrikeTimer expiryTimestamp={gameData?.lobbyData.damageTimer} />
      </div>

      <div className=" flex flex-col items-center gap-y-3">
        <WordContainer
          word={gameData?.words?.word1?.word}
          revealedIndex={gameData?.words?.word1?.revealedIndex}
          type={gameData?.words?.word1?.type}
          value={gameData?.words?.word1?.value}
        />
        <div className="flex flex-wrap justify-center gap-3">
          <WordContainer
            word={gameData?.words?.word2?.word}
            revealedIndex={gameData?.words?.word2?.revealedIndex}
            type={gameData?.words?.word2?.type}
            value={gameData?.words?.word2?.value}
          />
          <WordContainer
            word={gameData?.words?.word3?.word}
            revealedIndex={gameData?.words?.word3?.revealedIndex}
            type={gameData?.words?.word3?.type}
            value={gameData?.words?.word3?.value}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex w-[34vh] flex-col gap-2">
          <div className=" flex w-full items-center justify-between gap-2">
            <StatusBar statusValue={playerData?.shield} color="bg-sky-400" />
            <Image className="" src={shield} alt="shield Icon" />
          </div>

          <div className=" flex w-full items-center  gap-2">
            <StatusBar statusValue={playerData?.health} color="bg-green-400" />
            <Image className="" src={health} alt="shield Icon" />
          </div>
        </div>
        <div className="flex h-[7vh] w-[34vh] flex-row items-center justify-center gap-1 rounded-md border-2 bg-stone-300 p-1">
          <AnimatePresence>
            {guess.split("").map((letter: string, index: number) => {
              return <Tile letter={letter} key={index} />;
            })}
          </AnimatePresence>
        </div>
        <Keyboard disabled={false} handleKeyBoardLogic={handleKeyBoardLogic} />
      </div>
    </div>
  );
};

export default Survival;
