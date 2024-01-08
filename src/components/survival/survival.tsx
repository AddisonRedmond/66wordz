import { GameType } from "@prisma/client";
import useSurvialData from "../../custom-hooks/useSurvivalData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "./word-container";
import Keyboard from "../keyboard";
import { useState } from "react";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import shield from "../../../public/shield.svg";
import health from "../../../public/health.svg";
import StatusBar from "./status-bar";
import Image from "next/image";
import Opponent from "./opponent";
import {
  checkSpelling,
  handleCorrectGuess,
  wordLength,
  handleAttack,
} from "~/utils/surivival";
import GuessContainer from "./guess-container";

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
  const [spellCheck, setSpellCheck] = useState<boolean>(false);
  const [isAttack, setIsAttack] = useState<boolean>(false);

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

          setGuess("");
        }
      } else {
        // handle spell check is false
        setSpellCheck(true);
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

  const attackMode = () => {
    if (playerData?.attack === 0) {
      setIsAttack(false);
      return;
    }
    setIsAttack(!isAttack);
  };

  const attack = (playerId: string) => {
    if (!gameData?.players[playerId] || !isAttack) {
      return;
    } else {
      handleAttack(
        lobbyId,
        playerId,
        gameData.players[userId]!.attack,
        gameData.players[playerId]!,
        userId,
      );
      setIsAttack(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-around gap-12 ${
        isAttack ? `cursor-crosshair` : "cursor-default"
      }`}
    >
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
          attack={gameData?.words?.SIX_LETTER_WORD?.attack}
        />
        <div className="flex flex-wrap justify-center gap-3">
          <WordContainer
            word={gameData?.words?.FIVE_LETTER_WORD?.word}
            revealedIndex={gameData?.words?.FIVE_LETTER_WORD?.revealedIndex}
            type={gameData?.words?.FIVE_LETTER_WORD?.type}
            value={gameData?.words?.FIVE_LETTER_WORD?.value}
            attack={gameData?.words?.FIVE_LETTER_WORD?.attack}
          />
          <WordContainer
            word={gameData?.words?.FOUR_LETTER_WORD?.word}
            revealedIndex={gameData?.words?.FOUR_LETTER_WORD?.revealedIndex}
            type={gameData?.words?.FOUR_LETTER_WORD?.type}
            value={gameData?.words?.FOUR_LETTER_WORD?.value}
            attack={gameData?.words?.FOUR_LETTER_WORD?.attack}
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
          <div className="flex w-1/4 justify-around">
            {getHalfOfOpponents(true).map((playerId: string) => {
              if (playerId === userId) return;
              return (
                <Opponent
                  key={playerId}
                  playerId={playerId}
                  opponentData={gameData?.players[playerId]}
                  attack={attack}
                />
              );
            })}
          </div>

          {/* guess container + attack value and button */}
          <GuessContainer
            guess={guess}
            playerData={playerData}
            spellCheck={spellCheck}
            setSpellCheck={setSpellCheck}
            setIsAttack={attackMode}
            isAttack={isAttack}
          />
          <div className="flex w-1/4 justify-around">
            {getHalfOfOpponents(false).map((playerId: string) => {
              if (playerId === userId) return;
              return (
                <Opponent
                  key={playerId}
                  playerId={playerId}
                  opponentData={gameData?.players[playerId]}
                  attack={attack}
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
