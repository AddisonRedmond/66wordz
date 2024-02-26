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
  WordLength,
} from "~/utils/survival/surivival";
import GuessContainer from "./guess-container";
import Eliminated from "./eliminated";
import LoadingGame from "./loading-game";
import { AnimatePresence, useAnimate } from "framer-motion";
import AutoAttack from "./auto-attack";
import MobileAutoAttack from "./mobile-auto-attack";
import MobileAttack from "./mobile-attack";

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
  const [focus, setFocus] = useState<WordLength>("FOUR_LETTER_WORD");
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
          );

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

  const attack = async (playerId: string, func?: () => void) => {
    if (!gameData?.players[playerId] || !isAttack) {
      return;
    } else {
      await handleAttack(
        lobbyId,
        playerId,
        gameData.players[userId]!.attack,
        gameData.players[playerId]!,
        userId,
      );
      if (func) {
        func();
      }
      setTimeout(() => {
        setIsAttack(false);
      }, 1000);
    }
  };

  const getAllQualifiedPlayers = () => {
    let count = 0;
    Object.keys(gameData!.players).forEach((playerId) => {
      if (gameData?.players[playerId]?.eliminated === false) {
        count++;
      }
    });
    return count;
  };

  const getMatches = () => {
    if (focus === "FOUR_LETTER_WORD") {
      return playerData?.words.FOUR_LETTER_WORD.matches;
    } else if (focus === "FIVE_LETTER_WORD") {
      return playerData?.words.FIVE_LETTER_WORD.matches;
    } else if (focus === "SIX_LETTER_WORD") {
      return playerData?.words.SIX_LETTER_WORD.matches;
    }
  };

  if (gameData) {
    return (
      <div
        className={`flex flex-col items-center justify-around gap-0 md:gap-12 ${
          isAttack ? `custom-cursor` : "cursor-default"
        }`}
      >
        <AnimatePresence>
          {isMobile && isAttack && (
            <MobileAttack
              setIsAttack={setIsAttack}
              players={gameData.players}
              userId={userId}
              attack={attack}
            />
          )}
        </AnimatePresence>
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
          <div className=" flex flex-col items-center gap-y-3">
            <WordContainer
              word={playerData?.words?.SIX_LETTER_WORD?.word}
              type={playerData?.words?.SIX_LETTER_WORD?.type}
              value={playerData?.words?.SIX_LETTER_WORD?.value}
              attack={playerData?.words?.SIX_LETTER_WORD?.attack}
              match={playerData?.words?.SIX_LETTER_WORD?.matches?.full}
              focus={focus}
              setFocus={setFocus}
              infoDirection="right"
              infoHeight="top"
              id={"SIX_LETTER_WORD"}
            />
            <div className="flex flex-wrap justify-center gap-3">
              <WordContainer
                word={playerData?.words?.FIVE_LETTER_WORD?.word}
                type={playerData?.words?.FIVE_LETTER_WORD?.type}
                value={playerData?.words?.FIVE_LETTER_WORD?.value}
                attack={playerData?.words?.FIVE_LETTER_WORD?.attack}
                match={playerData?.words?.FIVE_LETTER_WORD?.matches?.full}
                focus={focus}
                setFocus={setFocus}
                infoDirection="left"
                infoHeight="bottom"
                id={"FIVE_LETTER_WORD"}
              />
              <WordContainer
                word={playerData?.words?.FOUR_LETTER_WORD?.word}
                type={playerData?.words?.FOUR_LETTER_WORD?.type}
                value={playerData?.words?.FOUR_LETTER_WORD?.value}
                attack={playerData?.words?.FOUR_LETTER_WORD?.attack}
                match={playerData?.words?.FOUR_LETTER_WORD?.matches?.full}
                focus={focus}
                setFocus={setFocus}
                infoDirection="right"
                infoHeight="bottom"
                id={"FOUR_LETTER_WORD"}
              />
            </div>
          </div>
        )}
        <div className="flex w-screen justify-around">
          {!isMobile && (
            <div className="flex w-1/4 flex-wrap justify-center overflow-hidden lg:w-1/3">
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
          <div className="flex w-screen flex-col items-center justify-center gap-4 sm:w-1/3">
            {/* nested ternairy. Only render out auto attack if game has started*/}

            {gameData?.lobbyData.gameStarted && (
              <>
                {isMobile ? (
                  <div className="flex w-screen flex-col items-center justify-center">
                    <p className="font-semibold">
                      Players Left - {getAllQualifiedPlayers()}
                    </p>
                    <MobileAutoAttack
                      first={
                        gameData?.players[
                          getPlayerPosition(gameData.players, "first", userId)
                        ]
                      }
                      last={
                        gameData?.players[
                          getPlayerPosition(gameData.players, "last", userId)
                        ]
                      }
                      autoAttack={autoAttack}
                      setAutoAttack={setAutoAttack}
                    />
                  </div>
                ) : (
                  // <> </>
                  <AutoAttack
                    autoAttack={autoAttack}
                    setAutoAttack={setAutoAttack}
                  />
                )}
              </>
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
              <div className="flex w-full flex-col items-center justify-center gap-y-3">
                {/* status indicators */}
                <div className=" relative flex h-3 w-10/12 max-w-96 items-center justify-between  gap-2">
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

                <div className="relative mb-2 flex h-3 w-10/12 max-w-96 items-center justify-between gap-2">
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

                <div className="relative">
                  {/* guess container + attack value and button */}
                  <div className="absolute top-0 w-full text-center">
                    <p
                      ref={scope}
                      className="text-3xl font-bold text-green-500"
                    >
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
                  matches={getMatches()}
                />
              </div>
            )}
          </div>
          {!isMobile && (
            <div className="flex w-1/4 flex-wrap justify-center overflow-hidden lg:w-1/3">
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
