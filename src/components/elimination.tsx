import useGameLobbyData from "../custom-hooks/useGameLobbyData"; // Import your custom hook
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { db } from "~/utils/firebase/firebase";
import GameGrid from "./game-grid";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  const TARGET_SCORE = 300;
  const gameData = useGameLobbyData(db, props);
  const [guess, setGuess] = useState("");
  const [keyBoardMatches, setKeyBoardMatches] = useState<Matches>({
    fullMatch: [],
    partialMatch: [],
    noMatch: [],
  });

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
          gameData.playerPoints[props.userId]!.points >= TARGET_SCORE) ||
        gameData.lobbyData?.gameStarted === false
      );
    };
    return (
      <>
        <Confetti active={runConfetti()} config={config} />
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
          <div className="absolute left-10 top-24">
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
                    wordLength={word.length}
                  />
                );
              })}
            </div>
          )}

          {gameData?.playerPoints?.[props.userId] ? (
            <div className="flex  flex-col items-center sm:gap-4">
              {isMobile && (
                <div>
                  {Object.keys(gameData.playerPoints).map(
                    (playerId: string, index: number) => {
                      return (
                        <OpponentMobile
                          key={playerId}
                          points={gameData.playerPoints[playerId]?.points}
                          matchingIndex={
                            gameData.roundData?.[playerId]?.matchingIndex
                          }
                          pointsGoal={TARGET_SCORE}
                        />
                      );
                    },
                  )}
                </div>
              )}

              {gameData.lobbyData.gameStarted && (
                <div className="text-center">
                  <p className="font-semibold sm:text-3xl">
                    Round {gameData?.lobbyData?.round}
                  </p>
                  <RoundTimer
                    expiryTimestamp={new Date(gameData.lobbyData.roundTimer)}
                  />
                </div>
              )}

              {points >= 300 ? (
                <Qualified />
              ) : (
                <>
                  {!gameData.lobbyData.gameStarted &&
                    gameData.lobbyData.gameStartTimer &&
                    gameData.lobbyData.round === 1 && (
                      <div className=" h-64">
                        <div className="mb-6 text-center font-semibold">
                          <p className="text-2xl">LOADING PLAYERS</p>
                          <p className="text-xl font-semibold">
                            {Object.keys(gameData.playerPoints).length} out of
                            66
                          </p>
                        </div>

                        <GameStartTimer
                          expiryTimestamp={
                            new Date(gameData?.lobbyData?.gameStartTimer)
                          }
                        />
                      </div>
                    )}

                  {gameData.lobbyData.gameStarted && (
                    <>
                      {
                        <p className="font-semibold">
                          {`${placement.topPlayers.indexOf(
                            props.userId,
                          )}${placementSuffix(
                            placement.topPlayers.indexOf(props.userId),
                          )} Place`}
                        </p>
                      }
                      {gameData?.lobbyData?.previousWord && (
                        <div className="text-center">
                          <p className="font-semibold text-neutral-600 sm:text-xl">
                            Previous word
                          </p>
                          <p className="font-semibold sm:text-2xl">
                            {gameData?.lobbyData?.previousWord}
                          </p>
                        </div>
                      )}
                      <WordContainer
                        word={word}
                        matchingIndex={matchingIndex}
                      />
                      <div className="mb-3 flex flex-col gap-3">
                        <Points
                          totalPoints={points}
                          pointsTarget={TARGET_SCORE}
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
                </>
              )}
            </div>
          ) : (
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
                    wordLength={word.length}
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      </>
    );
  } else {
    return <p>Loading!</p>;
  }
};

export default Elimination;
