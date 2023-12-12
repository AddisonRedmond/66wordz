import { useEffect, useState } from "react";
import {
  handleCorrectGuess,
  handleMatched,
  handleWordFailure,
  calculateTimePlayed,
} from "~/utils/game";
import {
  db,
  stopGame,
  updateGuessesAndAllGuesses,
} from "~/utils/firebase/firebase";
import words from "~/utils/dictionary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
// import { api } from "~/utils/api";
// import Confetti from "react-dom-confetti";
import useMarathonLobbyData from "../custom-hooks/useMarathonLobbyData";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import GameGrid from "./game-grid";
import Keyboard from "./keyboard";
import Timer from "./timer";
import GameStartTimer from "./game-start-timer";
import { startSoloGame, startUserTimer } from "~/utils/firebase/marathon";
import LoadingPlayers from "./loading-players";
import TotalTime from "./marathon/total-time";
import EliminationModal from "~/elimination/elimination-modal";
type MarathonProps = {
  lobbyId: string;
  userId: string;
  gameType: "MARATHON" | "ELIMINATION" | "ITEMS";
  exitMatch: () => void;
  isSolo: boolean;
};

type Matches = {
  fullMatch: string[];
  partialMatch: string[];
  noMatch: string[];
};

const Marathon: React.FC<MarathonProps> = (props: MarathonProps) => {
  const [guess, setGuess] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [fireSpellCheck, setFireSpellCheck] = useState<boolean>(false);

  // const [win, setWin] = useState<boolean>(false);

  // const endGame = api.public.endGame.useMutation();
  const gameData = useMarathonLobbyData(db, props);

  const [matches, setMatches] = useState<Matches>({
    fullMatch: [],
    partialMatch: [],
    noMatch: [],
  });

  const resetMatches = () => {
    setMatches({
      fullMatch: [],
      partialMatch: [],
      noMatch: [],
    });
  };

  const handleEndMatch = () => {
    setModalIsOpen(true);
  };

  // const playerHasWon = () => {
  //   setWin(true);
  //   handleEndMatch(true);
  // };

  // const checkIfWin = () => {};

  const handleKeyBoardLogic = (letter: string) => {
    const playerData = gameData?.players[props.userId];
    const {
      guesses = [],
      word = "ERROR",
      timer = 0,
      allGuesses = [],
      correctGuessCount = 0,
    } = playerData ?? {};
    if (!playerData) {
      return;
    } else if (letter === "Backspace" && guess.length > 0) {
      setGuess((prevGuess) => prevGuess.slice(0, -1));
    } else if (letter === "Enter" && guess.length === 5) {
      if (words.includes(guess)) {
        updateGuessesAndAllGuesses(
          props.lobbyId,
          props.userId,
          [...(guesses ?? []), guess],
          [...(allGuesses ?? []), guess],
          props.gameType,
        );
        setMatches(() => handleMatched(guesses, word));
        if (guess === word) {
          handleCorrectGuess(
            props.lobbyId,
            props.userId,
            timer,
            guesses.length,
            props.gameType,
            correctGuessCount,
          );
          setGuess("");
          resetMatches();
          return;
        } else if (guesses.length > 4) {
          handleWordFailure(
            guesses,
            word,
            props.lobbyId,
            props.userId,
            timer,
            props.gameType,
          );
          setGuess("");
          return;
        }
        setGuess("");
      } else {
        setFireSpellCheck(true);
      }
    } else if (
      /[a-zA-Z]/.test(letter) &&
      letter.length === 1 &&
      guess.length < 5
    ) {
      setGuess((prevGuess) => `${prevGuess}${letter}`.toUpperCase());
    }
  };
  const handleKeyUp = (e: KeyboardEvent) => {
    const letter = e.key;
    handleKeyBoardLogic(letter);
  };

  useEffect(() => {
    // check if user has a timer data already,
    if (
      gameData?.lobbyData.gameStarted &&
      !gameData.players[props.userId]?.timer
    ) {
      // if not, create one
      startUserTimer(props.userId, props.lobbyId);
    }
    // if not, create one
    // if they do, return nothing
  }, [gameData?.lobbyData.gameStarted]);

  useEffect(() => {
    if (gameData?.players?.[props.userId] && gameData.lobbyData.gameStarted) {
      const playerData = gameData.players[props.userId];

      window.addEventListener("keyup", handleKeyUp);
      setMatches(() =>
        handleMatched(
          playerData!.guesses ? playerData!.guesses : [],
          playerData!.word,
        ),
      );
      return () => {
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [guess, gameData]);

  useOnKeyUp(handleKeyUp, [guess, gameData]);

  // const config = {
  //   angle: 90,
  //   spread: 360,
  //   startVelocity: 40,
  //   elementCount: 70,
  //   dragFriction: 0.12,
  //   duration: 3000,
  //   stagger: 3,
  //   width: "10px",
  //   height: "10px",
  //   perspective: "500px",
  //   colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  // };

  if (gameData) {
    const playerData = gameData.players[props.userId];

    return (
      <>
        {modalIsOpen && (
          <EliminationModal>
            <div className=" flex w-[90vw] flex-col justify-center sm:h-48 sm:w-96">
              <p className="text-center text-xl font-semibold">Game Summary</p>
              <div className="flex flex-col items-center justify-center font-semibold">
                <div className="flex w-5/6 justify-between">
                  <p>Total Guesses</p>
                  <p>
                    {playerData?.allGuesses ? playerData.allGuesses.length : 0}
                  </p>
                </div>

                <div className="flex w-5/6 justify-between">
                  <p>Total Correct Guesses</p>
                  <p>{playerData?.correctGuessCount}</p>
                </div>

                <div className="flex w-5/6 justify-between">
                  <p>Total Time</p>
                  <p>
                    {calculateTimePlayed(
                      gameData.lobbyData.gameStartTimer,
                      playerData!.timer,
                    )}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => props.exitMatch()}
                  className="rounded-md bg-black p-2 text-white"
                >
                  Exit Game
                </button>
              </div>
            </div>
          </EliminationModal>
        )}
        <div className="flex flex-col items-center justify-center">
          <div className="relative -top-2 sm:absolute sm:left-10 sm:top-24">
            <button
              onClick={() => props.exitMatch()}
              className="rounded-md border-2 border-black p-2 text-xs font-semibold text-black duration-150 ease-in-out hover:bg-black hover:text-white"
            >
              {gameData.lobbyData?.gameStarted ? "Forfeit" : "Exit Match"}
            </button>
          </div>

          {gameData.lobbyData.gameStarted ? (
            <>
              {/* <Confetti active={modalIsOpen} config={config} /> */}
              <motion.div
                exit={{ scale: 0 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex w-full flex-col items-center justify-around"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  {gameData.lobbyData.gameStarted && (
                    <TotalTime
                      isTimerRunning={!modalIsOpen}
                      startTime={gameData.lobbyData.gameStartTimer}
                    />
                  )}
                  <div>
                    {playerData?.timer && (
                      <Timer
                        expiryTimestamp={new Date(playerData.timer)}
                        opponent={false}
                        endGame={() => handleEndMatch()}
                      />
                    )}

                    <GameGrid
                      disabled={!gameData.lobbyData.gameStarted}
                      guess={guess}
                      guesses={playerData?.guesses ?? []}
                      word={playerData?.word ?? ""}
                      rows={6}
                      spellCheck={fireSpellCheck}
                      setSpellCheck={setFireSpellCheck}
                    />
                  </div>
                  <Keyboard
                    matches={matches}
                    disabled={!gameData.lobbyData.gameStarted}
                    handleKeyBoardLogic={handleKeyBoardLogic}
                  />
                </div>
              </motion.div>
              <ToastContainer
                position="bottom-center"
                autoClose={1000}
                limit={3}
                newestOnTop={false}
                theme="dark"
              />
            </>
          ) : (
            <div>
              {props.isSolo ? (
                <p className="text-center text-2xl font-semibold">Solo Game</p>
              ) : (
                <LoadingPlayers
                  totalPlayers={Object.keys(gameData.players).length}
                />
              )}

              <GameStartTimer
                handleTimerEnd={() => {
                  props.isSolo ? startSoloGame(props.lobbyId) : undefined;
                }}
                expiryTimestamp={new Date(gameData.lobbyData.gameStartTimer)}
              />
            </div>
          )}
        </div>
      </>
    );
  } else {
    return <p>Loading!</p>;
  }
};

export default Marathon;
