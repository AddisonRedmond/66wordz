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
import Sword from "../../../public/Sword.svg";
import Image from "next/image";
import Opponent from "./opponent";
import {
  checkSpelling,
  handleCorrectGuess,
  wordLength,
} from "~/utils/surivival";

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
    const words = Object.keys(gameData?.words ?? []).map((word: string) => {
      return gameData?.words[word]?.word ?? "ERROR";
    });

    if (key === "Backspace" && guess.length > 0) {
      setGuess((prevGuess) => prevGuess.slice(0, -1));
    } else if (key === "Enter") {
      // spell check word
      const isSpellCheck = checkSpelling(guess);
      // if correct
      if (isSpellCheck) {
        if (words.includes(guess)) {
          // handle correct guess
          handleCorrectGuess(
            lobbyId,
            userId,
            wordLength(guess),
            guess,
            gameData?.players?.[userId],
            gameData?.words[wordLength(guess)],
          );
          setGuess("");
        } else {
          // handle incorrect guess
          // reset guess
          // animation
        }
      } else {
        // handle spell check is false
      }
    } else if (/[a-zA-Z]/.test(key) && key.length === 1 && guess.length < 6) {
      setGuess((prevGuess) => `${prevGuess}${key}`.toUpperCase());
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    handleKeyBoardLogic(e.key);
  };
  useOnKeyUp(handleKeyUp, [guess, gameData]);

  const playerData = gameData?.players[userId];

  const words = Object.keys(gameData?.words ?? []).sort(
    (a, b) => b.length - a.length,
  );

  const getHalfOfOpponents = (even: boolean): string[] => {
    if (even) {
      return Object.keys(gameData?.players ?? []).filter(
        (_, index: number) => index % 2 === 0,
      );
    } else {
      return Object.keys(gameData?.players ?? []).filter(
        (_, index: number) => index % 2 !== 0,
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-around gap-12">
      {/* div for game info */}
      <div>
        {/* <StrikeTimer expiryTimestamp={gameData?.lobbyData.damageTimer} /> */}
      </div>

      <div className=" flex flex-col items-center gap-y-3">
        <WordContainer
          word={gameData?.words?.SIX_LETTER_WORD?.word}
          revealedIndex={gameData?.words?.SIX_LETTER_WORD?.revealedIndex}
          type={gameData?.words?.SIX_LETTER_WORD?.type}
          value={gameData?.words?.SIX_LETTER_WORD?.value}
        />
        <div className="flex flex-wrap justify-center gap-3">
          <WordContainer
            word={gameData?.words?.FIVE_LETTER_WORD?.word}
            revealedIndex={gameData?.words?.FIVE_LETTER_WORD?.revealedIndex}
            type={gameData?.words?.FIVE_LETTER_WORD?.type}
            value={gameData?.words?.FIVE_LETTER_WORD?.value}
          />
          <WordContainer
            word={gameData?.words?.FOUR_LETTER_WORD?.word}
            revealedIndex={gameData?.words?.FOUR_LETTER_WORD?.revealedIndex}
            type={gameData?.words?.FOUR_LETTER_WORD?.type}
            value={gameData?.words?.FOUR_LETTER_WORD?.value}
          />
        </div>
      </div>

      {/* game ui layout -> health and shield + guess container + keybaord */}
      <div className="flex flex-col items-center gap-3">
        {/* status indicators */}
        <div className="flex w-[34vh] flex-col gap-2">
          <div className=" flex w-full items-center justify-between gap-2">
            <StatusBar statusValue={playerData?.shield} color="bg-sky-400" />
            <Image className="" src={shield} alt="shield Icon" />
          </div>

          <div className="flex w-full items-center justify-between gap-2">
            <StatusBar statusValue={playerData?.health} color="bg-green-400" />
            <Image src={health} alt="shield Icon" />
          </div>
        </div>

        <div className="flex w-screen justify-around">
          <div className="w-1/4">
            {getHalfOfOpponents(true).map((playerId: string) => {
              if (playerId === userId) return;
              return (
                <Opponent
                  key={playerId}
                  health={gameData?.players[playerId]?.health}
                  shield={gameData?.players[playerId]?.shield}
                />
              );
            })}
          </div>

          {/* guess container + attack value and button */}
          <div className="relative">
            <div className="flex h-[7vh] w-[34vh] flex-row items-center justify-center gap-1 rounded-md border-2 bg-stone-300 p-1">
              <AnimatePresence>
                {guess.split("").map((letter: string, index: number) => {
                  return <Tile letter={letter} key={index} />;
                })}
              </AnimatePresence>
            </div>

            <div
              className={`absolute -right-14 top-1/2 flex aspect-square w-12 -translate-y-1/2 transform cursor-pointer flex-col items-center justify-center rounded-full border-4 border-zinc-700  ${
                playerData?.attack === 0 ? "opacity-25" : "opacity-100"
              }`}
            >
              <div className={`absolute -top-6`}>
                <p className="font-semibold">{playerData?.attack}</p>
              </div>
              <Image src={Sword} alt="attack Icon" />
            </div>
          </div>
          <div className="w-1/4">
            {getHalfOfOpponents(false).map((playerId: string) => {
              if (playerId === userId) return;
              return (
                <Opponent
                  key={playerId}
                  health={gameData?.players[playerId]?.health}
                  shield={gameData?.players[playerId]?.shield}
                />
              );
            })}
          </div>
        </div>

        {/* keyboard */}
        <Keyboard disabled={false} handleKeyBoardLogic={handleKeyBoardLogic} />
      </div>
    </div>
  );
};

export default Survival;
