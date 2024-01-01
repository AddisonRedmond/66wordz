import useGameLobbyData from "../custom-hooks/useGameLobbyData"; // Import your custom hook
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { db } from "~/utils/firebase/firebase";
import GameGrid from "./game-grid";
import { useState, useEffect } from "react";
import { motion, useAnimate } from "framer-motion";
import GameStartTimer from "./game-start-timer";
import Keyboard from "./keyboard";
import WordContainer from "~/elimination/word-container";
import { api } from "~/utils/api";
import {
  calculateSpots,
  calculateTotalPlayers,
  getTopPlayersAndBots,
  handleCreateMatchingIndex,
  handleEliminationMatched,
  placementSuffix,
  spellCheck,
} from "~/utils/elimination";
import { updateGuessCountAndMatchingIndex } from "../utils/firebase/firebase";
import Points from "~/elimination/points";
import Qualified from "~/elimination/qualifeid";
import NextRoundTimer from "~/elimination/next-round-timer";
import EliminationModal from "~/elimination/elimination-modal";
import Confetti from "react-dom-confetti";
import Winner from "~/elimination/winner";
import Disqualfied from "~/elimination/disqualified";
import Opponent from "~/elimination/opponent";
import RoundTimer from "~/elimination/round-timer";
import { useIsMobile } from "~/custom-hooks/useIsMobile";
import OpponentMobile from "~/elimination/opponent-moblie";
import OpponentModal from "~/elimination/opponents-modal";
type EliminationProps = {
  lobbyId: string;
  userId: string;
  gameType: "MARATHON" | "ELIMINATION" | "ITEMS";
  exitMatch: () => void;
};

type Matches = {
  fullMatch: string[];
  partialMatch: string[];
  noMatch: string[];
};

type Player = {
  playerId: string;
  playerData:
    | {
        guessCount: number;
        matchingIndex?: number[] | undefined;
      }
    | undefined;
  points: number | undefined;
};

const Elimination: React.FC<EliminationProps> = (props: EliminationProps) => {
  const correctGuess = api.elimination.handleCorrectGuess.useMutation();
  const [fireSpellCheck, setFireSpellCheck] = useState<boolean>(false);
  const [gameStartTimer, setGameStartTimer] = useState<boolean>(false);
  const [opponentsModalIsOpen, setOpponentsModalIsOpen] =
    useState<boolean>(false);
  const gameData = useGameLobbyData(db, props);
  const [guess, setGuess] = useState("");
  const [keyBoardMatches, setKeyBoardMatches] = useState<Matches>({
    fullMatch: [],
    partialMatch: [],
    noMatch: [],
  });

  const [scope, animate] = useAnimate();

  const control = {
    color: ["#000000", "#65B741", "#000000"],
    scale: [1, 1.4, 1],
  };

  const isMobile = useIsMobile();

  const gamePath = `${props.gameType}/${props.lobbyId}/roundData/${props.userId}`;

  useEffect(() => {
    setKeyBoardMatches({
      fullMatch: [],
      partialMatch: [],
      noMatch: [],
    });
  }, [gameData?.lobbyData?.word]);

  useEffect(() => {
    if (
      !!gameData?.lobbyData?.nextRoundStartTime &&
      gameData?.lobbyData?.gameStarted === false
    ) {
      correctGuess.reset();
      setGameStartTimer(true);
    }
  }, [gameData]);

  useEffect(() => {
    if (gameData?.lobbyData.gameStarted && scope.current) {
      animate(scope.current, control, { duration: 0.3 });
    }
  }, [gameData?.lobbyData?.word]);

  const handleStartNextRound = () => {
    if (gameData) {
      setGameStartTimer(false);
    }
  };

  const handleKeyBoardLogic = (letter: string) => {
    if (gameData) {
      const { gameStarted, word, round } = gameData.lobbyData;
      const { guessCount = 0, matchingIndex = [] } =
        gameData?.roundData?.[props.userId] ?? {};

      const points = gameData?.playerPoints?.[props.userId]?.points ?? 0;
      if (!gameStarted) {
        return;
      }

      if (letter === "Backspace" && guess.length > 0) {
        setGuess((prevGuess) => prevGuess.slice(0, -1));
      } else if (letter === "Enter") {
        if (!spellCheck(guess)) {
          setFireSpellCheck(true);
          return;
        }

        // check if guess matches word
        if (guess === word) {
          correctGuess.mutate({
            gamePath: `ELIMINATION/${props.lobbyId}/playerPoints/${props.userId}`,
            guessCount: guessCount,
            points: points,
            lobbyId: props.lobbyId,
            roundNumber: round,
            previousWord: word,
          });

          setGuess("");
          setKeyBoardMatches({
            fullMatch: [],
            partialMatch: [],
            noMatch: [],
          });
          return;
        }
        // if it doesnt, increment number of guesses,
        else if (guess !== word) {
          // highlight matching letters, highlight semi-matching letters
          setKeyBoardMatches(
            handleEliminationMatched(guess, word, keyBoardMatches),
          );
          updateGuessCountAndMatchingIndex(
            gamePath,
            guessCount + 1,
            handleCreateMatchingIndex(guess, word, matchingIndex),
          );
          setGuess("");
        }
      } else if (
        /[a-zA-Z]/.test(letter) &&
        letter.length === 1 &&
        guess.length < 5
      ) {
        setGuess((prevGuess) => `${prevGuess}${letter}`.toUpperCase());
      }
    }
  };

  // main logic for game
  const handleKeyUp = (e: KeyboardEvent) => {
    handleKeyBoardLogic(e.key);
  };

  // returns half of the opponents based on their index being even or odd
  // returns an object that fits the player type in opponents
  const getHalfOfOpponents = (evenOdd: "even" | "odd") => {
    if (!gameData) {
      return [];
    }

    const isEvenIndex = (index: number) =>
      evenOdd === "even" ? index % 2 === 0 : index % 2 !== 0;

    const opponents = Object.keys(gameData.playerPoints || {})
      .filter((playerId) => playerId !== props.userId)
      .filter((_, index) => isEvenIndex(index + 1))
      .map((playerId) => ({
        playerId,
        playerData: gameData.roundData?.[playerId],
        points: gameData.playerPoints?.[playerId]?.points,
      }))
      .filter((opponent) => opponent.playerId !== props.userId);

    if (gameData?.botPoints) {
      const bots = Object.keys(gameData?.botPoints)
        .filter((_, index) => isEvenIndex(index))
        .map((botId) => {
          return {
            playerId: botId,
            playerData: gameData.roundData?.[botId],
            points: gameData.botPoints?.[botId]?.points,
          };
        });

      return [...opponents, ...bots].filter(
        (opponent) => opponent.playerId !== props.userId,
      );
    }

    return opponents.filter((opponent) => opponent.playerId !== props.userId);
  };

  useOnKeyUp(handleKeyUp, [guess, gameData]);

  const totalPlayers = calculateTotalPlayers(
    gameData?.playerPoints,
    gameData?.botPoints,
  );

  const availableSpots = calculateSpots(
    totalPlayers,
    gameData?.lobbyData?.round,
  );

  const placement = getTopPlayersAndBots(
    availableSpots,
    gameData?.playerPoints,
    gameData?.botPoints,
  );

  // TODO: remove props.userid from array, and add the next person in line
  const allPlayersAndBots = (numberOfPlayers?: number) => {
    if (!gameData) return [];

    const allPlayers = gameData?.playerPoints || {};
    const allBots = gameData?.botPoints ?? {};
    const combinedPlayerData = { ...allPlayers, ...allBots };

    if (numberOfPlayers) {
      const players = Object.keys(combinedPlayerData).slice(0, numberOfPlayers);
      return players.map((playerId: string) => {
        return {
          playerId: playerId,
          points: combinedPlayerData[playerId]?.points,
          matchingIndex: gameData.roundData?.[playerId]?.matchingIndex,
        };
      });
    } else {
      return Object.keys(combinedPlayerData).map((playerId: string) => {
        return {
          playerId: playerId,
          points: combinedPlayerData[playerId]?.points,
          matchingIndex: gameData.roundData?.[playerId]?.matchingIndex,
        };
      });
    }
  };

  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 140,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  const runConfetti = () => {
    if (gameData?.winner?.userId === props.userId) {
      return true;
    } else return false;
  };

  if (gameData) {
    const { word } = gameData.lobbyData || {
      gameStarted: false,
      word: "ERROR",
    };
    const { matchingIndex = [] } = gameData?.roundData?.[props.userId] ?? {};
    const points = gameData?.playerPoints?.[props.userId]?.points ?? 0;

    const guesses: string[] = gameData?.players || [];
    const isDisabled = () => {
      return (
        (gameData?.playerPoints?.[props.userId]?.points !== undefined &&
          gameData.playerPoints[props.userId]!.points >=
            gameData.lobbyData.pointsGoal) ||
        gameData.lobbyData?.gameStarted === false
      );
    };

    // console.log(allPlayersAndBots(9))
    return (
      <>
        {!isMobile && <Confetti active={runConfetti()} config={config} />}
        {gameStartTimer && gameData?.lobbyData?.nextRoundStartTime && (
          <EliminationModal>
            <NextRoundTimer
              expiryTimestamp={gameData?.lobbyData?.nextRoundStartTime}
              onEnd={() => handleStartNextRound()}
            />
          </EliminationModal>
        )}
        {gameData?.winner?.userId && (
          <>
            {gameData?.winner?.userId === props.userId ? (
              <EliminationModal>
                <Winner handleClick={props.exitMatch} />
              </EliminationModal>
            ) : (
              <EliminationModal>
                <Disqualfied handleClick={props.exitMatch} />
              </EliminationModal>
            )}
          </>
        )}

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="flex w-full items-center justify-evenly"
        >
          <div className="absolute right-20 top-2 sm:left-10 sm:top-24">
            <button
              onClick={() => props.exitMatch()}
              className="rounded-md border-2 border-black p-2 text-xs font-semibold text-black duration-150 ease-in-out hover:bg-black hover:text-white"
            >
              {gameData.lobbyData?.gameStarted ? "Forfeit" : "Exit Match"}
            </button>
          </div>

          {!isMobile && (
            <div className="flex w-1/3 flex-wrap justify-around gap-x-1 gap-y-2 overflow-hidden">
              {getHalfOfOpponents("even").map((player: Player) => {
                return (
                  <Opponent
                    key={player.playerId}
                    numOfOpponents={getHalfOfOpponents("even").length}
                    points={player?.points}
                    matchingIndex={player.playerData?.matchingIndex}
                    wordLength={word.length ?? 0}
                    targetPoints={gameData.lobbyData.pointsGoal}
                  />
                );
              })}
            </div>
          )}

          {!gameData.lobbyData.gameStarted &&
            gameData.lobbyData.gameStartTimer &&
            gameData.lobbyData.round === 1 && (
              <div className=" h-64">
                <div className="mb-6 text-center font-semibold">
                  <p className="text-2xl">LOADING PLAYERS</p>
                </div>

                <GameStartTimer
                  expiryTimestamp={
                    new Date(gameData?.lobbyData?.gameStartTimer)
                  }
                />
              </div>
            )}

          {gameData?.playerPoints?.[props.userId] &&
            gameData.lobbyData.gameStarted && (
              <div className="flex flex-col items-center sm:gap-4">
                {isMobile && (
                  <div className="relative grid grid-flow-col grid-rows-2 gap-4">
                    <p className=" absolute -top-6 left-0 text-sm font-semibold">
                      Other Players
                    </p>
                    {allPlayersAndBots(9).map(
                      (playerObject: {
                        playerId: string;
                        points: number | undefined;
                        matchingIndex: number[] | undefined;
                      }) => {
                        return (
                          <OpponentMobile
                            key={playerObject.playerId}
                            points={playerObject.points}
                            matchingIndex={playerObject.matchingIndex}
                            pointsGoal={gameData.lobbyData.pointsGoal}
                          />
                        );
                      },
                    )}
                    {gameData.lobbyData.gameStarted && (
                      <>
                        <button
                          onClick={() => {
                            setOpponentsModalIsOpen(true);
                          }}
                          className="flex aspect-square justify-center rounded-full border-2 border-neutral-600 text-xl font-bold text-black"
                        >
                          . . .
                        </button>
                        <OpponentModal isOpen={opponentsModalIsOpen}>
                          <div className="px-2 text-center">
                            <p className="mb-2 text-lg font-semibold">
                              Opponents
                            </p>
                            <div className="grid grid-cols-4 gap-4">
                              {allPlayersAndBots().map(
                                (playerObject: {
                                  playerId: string;
                                  points: number | undefined;
                                  matchingIndex: number[] | undefined;
                                }) => {
                                  return (
                                    <OpponentMobile
                                      key={playerObject.playerId}
                                      points={playerObject.points}
                                      matchingIndex={playerObject.matchingIndex}
                                      pointsGoal={gameData.lobbyData.pointsGoal}
                                    />
                                  );
                                },
                              )}
                            </div>
                            <button
                              onClick={() => setOpponentsModalIsOpen(false)}
                              className="mt-2 rounded-md bg-black p-2 text-white"
                            >
                              Close
                            </button>
                          </div>
                        </OpponentModal>
                      </>
                    )}
                  </div>
                )}

                {gameData.lobbyData.gameStarted && (
                  <>
                    <div>
                      <p className="font-semibold sm:text-3xl">
                        Round {gameData?.lobbyData?.round}
                      </p>
                    </div>

                    <div className="flex h-20 items-start gap-4 text-center">
                      <RoundTimer
                        expiryTimestamp={
                          new Date(gameData.lobbyData.roundTimer)
                        }
                      />
                      <div className="h-full w-20 text-center text-sm font-semibold">
                        <p className="text-neutral-600 ">
                          <span>Current</span>
                          <br /> <span>Place</span>
                        </p>
                        <p className="white font-semibold">
                          {`${
                            placement.topPlayers.indexOf(props.userId) + 1
                          }${placementSuffix(
                            placement.topPlayers.indexOf(props.userId) + 1,
                          )}`}
                        </p>
                      </div>

                      <div className="h-full w-20 text-center text-sm font-semibold">
                        <p className="text-neutral-600 ">
                          <span>Previous</span>
                          <br /> <span>word</span>
                        </p>
                        <p ref={scope} className="text-lg font-semibold">
                          {gameData?.lobbyData?.previousWord
                            ? gameData?.lobbyData?.previousWord
                            : "..."}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {points >= gameData.lobbyData.pointsGoal && <Qualified />}

                {gameData.lobbyData.gameStarted &&
                  !(points >= gameData.lobbyData.pointsGoal) && (
                    <>
                      <WordContainer
                        word={word}
                        matchingIndex={matchingIndex}
                      />
                      <div className="mb-3 mt-2 flex flex-col gap-2">
                        <Points
                          totalPoints={points}
                          pointsTarget={gameData.lobbyData.pointsGoal}
                          showPoints={true}
                        />
                        <GameGrid
                          guess={guess}
                          guesses={guesses}
                          word={word}
                          disabled={isDisabled()}
                          rows={1}
                          spellCheck={fireSpellCheck}
                          setSpellCheck={setFireSpellCheck}
                        />
                      </div>
                      <Keyboard
                        disabled={isDisabled()}
                        matches={keyBoardMatches}
                        handleKeyBoardLogic={handleKeyBoardLogic}
                      />
                    </>
                  )}
              </div>
            )}

          {!gameData.playerPoints?.[props.userId] && (
            <Disqualfied handleClick={props.exitMatch} />
          )}

          {!isMobile && (
            <div className="flex w-1/3 flex-wrap justify-around gap-x-1 gap-y-2 overflow-hidden">
              {getHalfOfOpponents("odd").map((player: Player) => {
                return (
                  <Opponent
                    key={player.playerId}
                    numOfOpponents={getHalfOfOpponents("odd").length}
                    points={player?.points}
                    matchingIndex={player.playerData?.matchingIndex}
                    wordLength={word.length ?? 0}
                    targetPoints={gameData.lobbyData.pointsGoal}
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      </>
    );
  } else {
    return (
      <div>
        <p>Loading!</p>
        <button
          onClick={() => props.exitMatch()}
          className="rounded-md border-2 border-black p-2 text-xs font-semibold text-black duration-150 ease-in-out hover:bg-black hover:text-white"
        >
          Exit Match
        </button>
      </div>
    );
  }
};

export default Elimination;
