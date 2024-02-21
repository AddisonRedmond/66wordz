import { GameType } from "@prisma/client";
import useSurvialData from "../../custom-hooks/useSurvivalData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "./word-container";
import Keyboard from "../keyboard";
import { useState, useEffect } from "react";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useIsMobile } from "~/custom-hooks/useIsMobile";
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
  handleIncorrectGuess,
  getPlayerPosition,
} from "~/utils/survival/surivival";
import GuessContainer from "./guess-container";
import Eliminated from "./eliminated";
import LoadingGame from "./loading-game";
import { useAnimate } from "framer-motion";
import AutoAttack from "./auto-attack";

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
  const [correctGuess, setCorrectGuess] = useState<boolean>(false);
  const [incorrectGuess, setIncorrectGuess] = useState<boolean>(false);
  const [autoAttack, setAutoAttack] = useState<
    "first" | "last" | "random" | "off"
  >("off");
  const [scope, animate] = useAnimate();
  const isMobile = useIsMobile();

  const playerData = gameData?.players[userId];

  // TODO: make a better correct guess animation

  const control = { y: [0, -50], opacity: [100, 0], zIndex: [1, 1] };
  useEffect(() => {
    if (scope.current) {
      animate(scope.current, control, { duration: 1.5 });
    }
  }, [correctGuess]);

  const handleKeyBoardLogic = (key: string) => {
    const words = Object.keys(playerData!.words).map((key: string) => {
      return playerData?.words[key as keyof typeof playerData.words]?.word;
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
          const playerToAttack = getPlayerPosition(
            gameData!.players,
            autoAttack,
            userId,
          ) as string;

          if (autoAttack !== "off") {
            handleAttack(
              lobbyId,
              playerToAttack,
              playerData?.words[wordLength(guess)]?.attack ?? 0,
              gameData!.players[playerToAttack]!,
              userId,
            );
          }

          handleCorrectGuess(
            lobbyId,
            userId,
            wordLength(guess),
            guess,
            autoAttack,
            gameData?.players?.[userId],
            playerData?.words[wordLength(guess)],
          );

          setGuess("");
          setCorrectGuess(true);
        } else {
          // handle incorrect guess
          // reset guess
          // animation

          // get current matching indexes
          const matchingIndexes = {
            FIVE_LETTER_WORD: playerData?.words.FIVE_LETTER_WORD.matches,
            FOUR_LETTER_WORD: playerData?.words.FOUR_LETTER_WORD.matches,
            SIX_LETTER_WORD: playerData?.words.SIX_LETTER_WORD.matches,
          };

          setGuess("");
          setIncorrectGuess(true);
          handleIncorrectGuess(
            guess,
            lobbyId,
            userId,
            playerData!.words,
            matchingIndexes,
          );
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

  const attack = (playerId: string, func: () => void) => {
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
      func();
      setIsAttack(false);
    }
  };

  if (gameData) {
    return (
      <div
        className={`flex flex-col items-center justify-around gap-0 md:gap-12 ${
          isAttack ? `custom-cursor` : "cursor-default"
        }`}
      >
        <button
          onClick={() => exitMatch()}
          className="duration absolute right-72 top-2 hidden rounded-md bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700 sm:block "
        >
          QUIT GAME
        </button>
        {/* div for game info */}
        <div>
          {/* <StrikeTimer expiryTimestamp={gameData?.lobbyData.damageTimer} /> */}
        </div>

        {gameData?.lobbyData.gameStarted && (
          <>
            <div className=" flex flex-col items-center gap-y-3">
              <WordContainer
                word={playerData?.words?.SIX_LETTER_WORD?.word}
                type={playerData?.words?.SIX_LETTER_WORD?.type}
                value={playerData?.words?.SIX_LETTER_WORD?.value}
                attack={playerData?.words?.SIX_LETTER_WORD?.attack}
                match={playerData?.words?.SIX_LETTER_WORD.matches}
                infoDirection="right"
              />
              <div className="flex flex-wrap justify-center gap-3">
                <WordContainer
                  word={playerData?.words?.FIVE_LETTER_WORD?.word}
                  type={playerData?.words?.FIVE_LETTER_WORD?.type}
                  value={playerData?.words?.FIVE_LETTER_WORD?.value}
                  attack={playerData?.words?.FIVE_LETTER_WORD?.attack}
                  match={playerData?.words?.FIVE_LETTER_WORD.matches}
                  infoDirection="left"
                />
                <WordContainer
                  word={playerData?.words?.FOUR_LETTER_WORD?.word}
                  type={playerData?.words?.FOUR_LETTER_WORD?.type}
                  value={playerData?.words?.FOUR_LETTER_WORD?.value}
                  attack={playerData?.words?.FOUR_LETTER_WORD?.attack}
                  match={playerData?.words?.FOUR_LETTER_WORD.matches}
                  infoDirection="right"
                />
              </div>
            </div>
            {isMobile ? (
              <div className="h-20 w-full border-2 border-black">
                <p>Mobile Info Panel</p>
              </div>
            ) : (
              <AutoAttack
                autoAttack={autoAttack}
                setAutoAttack={setAutoAttack}
              />
            )}
          </>
        )}

        <div className="justy flex w-screen items-center justify-center gap-4">
          {!isMobile && (
            <div className="flex w-1/3 flex-wrap justify-center overflow-hidden">
              {getHalfOfOpponents(false).map((playerId: string) => {
                if (playerId === userId) return;
                return (
                  <Opponent
                    key={playerId}
                    playerId={playerId}
                    opponentData={gameData?.players[playerId]}
                    attack={attack}
                    opponentCount={getHalfOfOpponents(false).length}
                    attackValue={playerData?.attack}
                  />
                );
              })}
            </div>
          )}
          {/* nester ternary check to see if game started, if it hasn't then load the timer, 
          if it has then check if the player has been eliminate, if they haven't then load the game components */}
          {!gameData?.lobbyData.gameStarted ? (
            <LoadingGame
              expiryTimestamp={new Date(gameData.lobbyData.gameStartTime)}
            />
          ) : playerData?.eliminated ? (
            <Eliminated exitMatch={exitMatch} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-y-5">
              {/* status indicators */}
              <div className="flex w-[80vw] flex-col gap-2 md:w-[34vh]">
                <div className=" relative flex h-3 w-full items-center justify-between  gap-2">
                  <StatusBar
                    statusValue={playerData?.shield}
                    color="bg-sky-400"
                  />
                  <Image
                    className="absolute -right-6"
                    src={shield}
                    alt="shield Icon"
                  />
                </div>

                <div className="relative mb-2 flex h-3 w-full items-center justify-between gap-2">
                  <StatusBar
                    statusValue={playerData?.health}
                    color="bg-green-400"
                  />
                  <Image
                    className="absolute -right-6"
                    src={health}
                    alt="shield Icon"
                  />
                </div>
              </div>

              <div className="relative">
                {/* guess container + attack value and button */}
                <div className="absolute top-0 w-full text-center">
                  <p ref={scope} className="text-3xl font-bold text-green-500">
                    Success!
                  </p>
                </div>
                <GuessContainer
                  guess={guess}
                  playerData={playerData}
                  spellCheck={spellCheck}
                  setSpellCheck={setSpellCheck}
                  setIsAttack={attackMode}
                  isAttack={isAttack}
                  incorrectGuess={incorrectGuess}
                  setIsIncorrectGuess={setIncorrectGuess}
                />
              </div>

              {/* keyboard */}
              <Keyboard
                disabled={false}
                handleKeyBoardLogic={handleKeyBoardLogic}
              />
            </div>
          )}

          {!isMobile && (
            <div className="flex w-1/3 flex-wrap justify-center overflow-hidden">
              {getHalfOfOpponents(true).map((playerId: string) => {
                if (playerId === userId) return;
                return (
                  <Opponent
                    key={playerId}
                    playerId={playerId}
                    opponentData={gameData?.players[playerId]}
                    attack={attack}
                    opponentCount={getHalfOfOpponents(true).length}
                    attackValue={playerData?.attack}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default Survival;
