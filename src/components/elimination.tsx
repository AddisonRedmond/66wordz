import useGameLobbyData from "../custom-hooks/useGameLobbyData"; // Import your custom hook
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { db } from "~/utils/firebase/firebase";
import GameGrid from "./game-grid";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Keyboard from "./keyboard";
import WordContainer from "~/elimination/word-container";
import { api } from "~/utils/api";
import {
  handleCreateMatchingIndex,
  handleEliminationMatched,
  spellCheck,
} from "~/utils/elimination";
import { updateGuessCountAndMatchingIndex } from "../utils/firebase/firebase";
import Points from "~/elimination/points";
import OpponentsContainer from "~/elimination/opponents-container";
import { ToastContainer, toast } from "react-toastify";
import Qualified from "~/elimination/qualifeid";
import NextRoundTimer from "~/elimination/next-round-timer";
import EliminationModal from "~/elimination/elimination-modal";
import Confetti from "react-dom-confetti";
import Winner from "~/elimination/winner";
import Disqualfied from "~/elimination/disqualified";
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

const Elimination: React.FC<EliminationProps> = (props: EliminationProps) => {
  const correctGuess = api.elimination.handleCorrectGuess.useMutation();
  const startGame = api.elimination.startGame.useMutation();
  const [gameStartTimer, setGameStartTimer] = useState<boolean>(false);
  const TARGET_SCORE = 500;
  const gameData = useGameLobbyData(db, props);
  const [guess, setGuess] = useState("");
  const [keyBoardMatches, setKeyBoardMatches] = useState<Matches>({
    fullMatch: [],
    partialMatch: [],
    noMatch: [],
  });
  const notify = () => toast.warn(`${guess} not in word list!`);
  const gamePath = `${props.gameType}/${props.lobbyId}/roundData/${props.userId}`;

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
      if (!!gameData?.lobbyData?.nextRoundStartTime === true) {
        return;
      } else {
        const playerIds = Object.keys(gameData.playerPoints);
        if (playerIds[0] === props.userId) {
          startGame.mutate({ lobbyId: props.lobbyId });
        }
        setGameStartTimer(false);
      }
    }
  };

  // main logic for game
  const handleKeyUp = (e: KeyboardEvent) => {
    if (gameData) {
      const { gameStarted, word, round } = gameData.lobbyData;
      const { guessCount = 0, matchingIndex = [] } =
        gameData?.roundData?.[props.userId] ?? {};

      const points = gameData?.playerPoints?.[props.userId]?.points ?? 0;
      if (!gameStarted) {
        return;
      }

      if (e.key === "Backspace" && guess.length > 0) {
        setGuess((prevGuess) => prevGuess.slice(0, -1));
      } else if (e.key === "Enter") {
        if (!spellCheck(guess)) {
          notify();
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
        /[a-zA-Z]/.test(e.key) &&
        e.key.length === 1 &&
        guess.length < 5
      ) {
        setGuess((prevGuess) => `${prevGuess}${e.key}`.toUpperCase());
      }
    }
  };

  const getHalfOfOpponents = (evenOdd: "even" | "odd") => {
    if (gameData) {
      if (evenOdd === "even") {
        return Object.keys(gameData?.playerPoints || {})
          .filter((_, index) => index % 2 === 0)
          .map((playerId) => ({
            playerId: playerId,
            playerData: gameData?.roundData?.[playerId],
            points: gameData.playerPoints?.[playerId]?.points,
          }))
          .filter((opponent) => opponent.playerId !== props.userId);
      } else {
        return Object.keys(gameData?.playerPoints || {})
          .filter((_, index) => index % 2 !== 0)
          .map((playerId) => ({
            playerId: playerId,
            playerData: gameData?.roundData?.[playerId],
            points: gameData.playerPoints?.[playerId]?.points,
          }))
          .filter((opponent) => opponent.playerId !== props.userId);
      }
    }
  };

  useOnKeyUp(handleKeyUp, [guess, gameData]);

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
        gameData?.playerPoints?.[props.userId]?.points !== undefined &&
        gameData.playerPoints[props.userId]!.points >= TARGET_SCORE
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

        <ToastContainer
          position="bottom-center"
          autoClose={1000}
          limit={3}
          newestOnTop={false}
          theme="dark"
        />
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
              {gameData.lobbyData.gameStarted ? "Forfeit" : "Exit Match"}
            </button>
          </div>

          <OpponentsContainer
            players={getHalfOfOpponents("even")}
            word={word}
          />

          {gameData?.playerPoints?.[props.userId] && (
            <div className="flex  flex-col items-center gap-4">
              {!correctGuess.data?.qualified ? (
                <>
                  <WordContainer word={word} matchingIndex={matchingIndex} />
                  <div className="flex flex-col gap-3">
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
                    />
                  </div>

                  <Keyboard disabled={isDisabled()} matches={keyBoardMatches} />
                </>
              ) : (
                <Qualified />
              )}
            </div>
          )}

          <OpponentsContainer players={getHalfOfOpponents("odd")} word={word} />
        </motion.div>
      </>
    );
  } else {
    return <p>Loading!</p>;
  }
};

export default Elimination;
