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
  handleAttack,
  handleIncorrectGuess,
  getPlayerPosition,
} from "~/utils/survival/surivival";
import GuessContainer from "./guess-container";
import Eliminated from "./eliminated";
import LoadingGame from "../loading-game";
import { AnimatePresence, useAnimate } from "framer-motion";
import AutoAttack from "./auto-attack";
import MobileAutoAttack from "./mobile-auto-attack";
import MobileAttack from "./mobile-attack";
import useSound from "use-sound";
import Confetti from "react-confetti";
import { api } from "~/utils/api";
export type AutoAttackOption = "first" | "last" | "random" | string;

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

  const startGame = api.createGame.startGame.useMutation();

  const [guess, setGuess] = useState<string>("");
  const [spellCheck, setSpellCheck] = useState<boolean>(false);
  const [correctGuess, setCorrectGuess] = useState<boolean>(false);
  const [incorrectGuess, setIncorrectGuess] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [autoAttack, setAutoAttack] = useState<AutoAttackOption>("random");
  const [scope, animate] = useAnimate();
  const isMobile = useIsMobile();
  const playerData = gameData?.players[userId];

  const [popSound] = useSound("/sounds/pop-2.mp3", {
    volume: 1,
    playbackRate: 1.5,
  });

  const [deleteSound] = useSound("/sounds/delete2.mp3", {
    volume: 1,
    playbackRate: 1.5,
  });

  // const [gameMusic, { stop }] = useSound("/sounds/game_music.mp3", {
  //   volume: 0.25,
  //   playbackRate: 1,
  //   onEnd: () => {
  //     gameMusic();
  //   },
  // });

  // TODO: make a better correct guess animation

  const ownerStart = () => {
    if (startGame.isLoading) {
      return;
    }
    startGame.mutate();
  };

  const control = { y: [0, -50], opacity: [100, 0], zIndex: [1, 1] };
  useEffect(() => {
    if (scope.current) {
      animate(scope.current, control, { duration: 1.5 });
    }
  }, [correctGuess]);

  const targetOpponent = (playerId: string) => {
    if (playerData?.eliminated) {
      return;
    }
    if (
      !gameData?.players[playerId]?.eliminated ||
      playerId === "random" ||
      playerId === "first" ||
      playerId === "last"
    ) {
      setAutoAttack(playerId);
    }
  };

  const handleKeyBoardLogic = async (key: string) => {
    const word = playerData?.word?.word;

    if (playerData?.eliminated || !gameData?.lobbyData.gameStarted) return;

    if (key === "Backspace" && guess.length > 0) {
      setGuess((prevGuess) => {
        deleteSound();
        return prevGuess.slice(0, -1);
      });
    } else if (key === "Enter" && guess.length >= 5) {
      // spell check word
      const isSpellCheck = checkSpelling(guess);
      // if correct
      if (isSpellCheck) {
        if (word === guess) {
          // handle correct guess
          const playerToAttack = getPlayerPosition(
            gameData.players,
            autoAttack,
            userId,
          );

          const eliminated = await handleAttack(
            lobbyId,
            playerToAttack,
            playerData?.word.attack ?? 0,
            gameData.players[playerToAttack]!,
          );

          handleCorrectGuess(
            lobbyId,
            userId,
            gameData?.players?.[userId],
            playerData?.word,
          );

          setGuess("");
          setCorrectGuess(true);

          if (eliminated) {
            setAutoAttack("first");
          }
        } else {
          setGuess("");
          setIncorrectGuess(true);
          handleIncorrectGuess(guess, lobbyId, userId, playerData!.word);
        }
      } else {
        // handle spell check is false
        setSpellCheck(true);
      }
    } else if (/[a-zA-Z]/.test(key) && key.length === 1 && guess.length < 5) {
      popSound();
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

  const getAllQualifiedPlayers = () => {
    let count = 0;
    Object.keys(gameData!.players).forEach((playerId) => {
      if (gameData?.players[playerId]?.eliminated === false) {
        count++;
      }
    });
    return count;
  };

  if (gameData?.players[autoAttack]?.eliminated === true) {
    setAutoAttack("first");
  }

  if (gameData) {
    if (gameData.lobbyData?.winner === userId) {
      return (
        <div className="grid w-full place-content-center">
          <Confetti width={window.innerWidth} />
          <p className=" text-3xl font-semibold">You Won!</p>
          <button
            onClick={() => exitMatch()}
            className="duration rounded-md bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700"
          >
            LEAVE GAME
          </button>
        </div>
      );
    }

    return (
      <div
        className={`flex cursor-pointer flex-col items-center justify-around gap-3`}
      >
        <AnimatePresence>
          {isMobile && mobileMenuOpen && (
            <MobileAttack
              players={gameData.players}
              userId={userId}
              setMobileMenuOpen={setMobileMenuOpen}
              setAutoAttack={targetOpponent}
              autoAttack={autoAttack}
            />
          )}
        </AnimatePresence>

        {/* div for game info */}

        {gameData?.lobbyData?.gameStarted && (
          <WordContainer
            word={playerData?.word.word}
            type={playerData?.word.type}
            value={playerData?.word.value}
            attack={playerData?.word.attack}
            match={playerData?.word.matches?.full}
            eliminated={playerData?.eliminated}
          />
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
                    opponentCount={getHalfOfOpponents(false).length}
                    setAutoAttack={targetOpponent}
                    autoAttack={autoAttack}
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
                      setMobileMenuOpen={setMobileMenuOpen}
                      target={
                        gameData?.players[
                          getPlayerPosition(
                            gameData.players,
                            autoAttack,
                            userId,
                          )
                        ]
                      }
                    />
                  </div>
                ) : (
                  <AutoAttack
                    autoAttack={autoAttack}
                    setAutoAttack={targetOpponent}
                  />
                )}
              </>
            )}

            {/* nester ternary check to see if game started, if it hasn't then load the timer, 
          if it has then check if the player has been eliminate, if they haven't then load the game components */}
            {!gameData?.lobbyData.gameStarted ? (
              <>
                <button
                  onClick={() => exitMatch()}
                  className="rounded-md bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700 sm:right-72 sm:top-2 sm:block "
                >
                  QUIT
                </button>
                <LoadingGame
                  expiryTimestamp={new Date(gameData.lobbyData.gameStartTime)}
                  gameOwner={gameData.lobbyData.owner}
                  isGameOwner={gameData.lobbyData.owner === userId}
                  startGame={ownerStart}
                  playerCount={Object.keys(gameData.players).length}
                  exitMatch={exitMatch}
                  lobbyId={lobbyId}
                />
              </>
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
                    incorrectGuess={incorrectGuess}
                    setIsIncorrectGuess={setIncorrectGuess}
                  />
                </div>

                {/* keyboard */}
                <Keyboard
                  disabled={false}
                  handleKeyBoardLogic={handleKeyBoardLogic}
                  matches={playerData?.word.matches}
                />
                <button
                  onClick={() => {
                    exitMatch(), stop();
                  }}
                  className="rounded-md bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700 sm:right-72 sm:top-2 sm:block "
                >
                  QUIT
                </button>
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
                    opponentCount={getHalfOfOpponents(true).length}
                    setAutoAttack={targetOpponent}
                    autoAttack={autoAttack}
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
