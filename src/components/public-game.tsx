import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import {
  db,
  handleStartTimer,
  startGame,
  updateGuessesAndAllGuesses,
} from "~/utils/firebase/firebase";
import Keyboard from "./keyboard";
import GameGrid from "./game-grid";
import {
  canculateTimePlayed,
  formatGameData,
  handleCorrectGuess,
  handleMatched,
  handleWordFailure,
} from "~/utils/game";
import Opponent from "./opponent";
import Timer from "./timer";
import words from "~/utils/words";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./modal";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "~/utils/api";

type PublicGameProps = {
  lobbyId: string;
  userId: string;
  exitMatch: () => void;
};

type Matches = {
  fullMatch: string[];
  partialMatch: string[];
  noMatch: string[];
};

const PublicGame: React.FC<PublicGameProps> = (props: PublicGameProps) => {
  const [gameData, setGameData] = useState<any>(null);
  const [guess, setGuess] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const endGame = api.public.endGame.useMutation();
  const manualStart = api.public.manualStart.useMutation();
  const [endGameSummary, setEndGameSummary] = useState<{
    placement: number;
    totalTime: string;
    totalGuesses: number;
  } | null>(null);

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
    const { allGuesses, timer } = gameData.players[props.userId];
    setEndGameSummary({
      placement: Object.keys(gameData.players).length,
      totalTime: canculateTimePlayed(gameData.startTime, timer),
      totalGuesses: allGuesses?.length ? allGuesses.length : 0,
    });

    // handleRemoveUserFromLobby(props.lobbyId, props.userId);
    endGame.mutate();
    setModalIsOpen(true);
  };

  const notify = () => toast.warn(`${guess} not in word list!`);

  const handleManualStart = async () => {
    await startGame(props.lobbyId);
    manualStart.mutate(props.lobbyId);
  };

  useEffect(() => {
    const playersQuery = ref(db, `publicLobbies/${props.lobbyId}`);
    const handlePlayersDataChange = (snapShot: any) => {
      const gameData: any = snapShot.val();
      setGameData(gameData);
    };

    const unsubscribe = onValue(playersQuery, handlePlayersDataChange);

    return () => {
      off(playersQuery, "value", handlePlayersDataChange);

      unsubscribe();
    };
  }, [props.lobbyId]);

  useEffect(() => {
    if (
      gameData?.gameStarted === true &&
      !gameData?.players[props.userId].timer
    ) {
      handleStartTimer(props.lobbyId, props.userId);
    }
  }, [gameData?.gameStarted]);

  useEffect(() => {
    if (gameData?.players[props.userId] && gameData.gameStarted) {
      const playerData = formatGameData(gameData.players[props.userId]);
      const handleKeyUp = async (e: KeyboardEvent) => {
        if (e.key === "Backspace" && guess.length > 0) {
          setGuess((prevGuess) => prevGuess.slice(0, -1));
        } else if (e.key === "Enter" && guess.length === 5) {
          if (words.includes(guess)) {
            await updateGuessesAndAllGuesses(
              props.lobbyId,
              props.userId,
              [...playerData.guesses, guess],
              [...playerData.allGuesses, guess],
            );
            if (guess === playerData.word) {
              handleCorrectGuess(
                props.lobbyId,
                props.userId,
                playerData.timer,
                playerData.guesses.length,
              );
              setGuess("");
              resetMatches();
              return;
            } else if (playerData.guesses.length > 4) {
              handleWordFailure(
                playerData.guesses,
                playerData.word,
                props.lobbyId,
                props.userId,
                gameData.players[props.userId].timer,
              );
              setGuess("");
              return;
            }
            setGuess("");
          } else {
            notify();
          }
        } else if (
          /[a-zA-Z]/.test(e.key) &&
          e.key.length === 1 &&
          guess.length < 5
        ) {
          setGuess((prevGuess) => `${prevGuess}${e.key}`.toUpperCase());
        }
      };

      window.addEventListener("keyup", handleKeyUp);
      setMatches(() =>
        handleMatched(
          playerData.guesses ? playerData.guesses : [],
          playerData.word,
        ),
      );
      return () => {
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [guess, gameData]);

  if (gameData?.players) {
    const playerData = formatGameData(gameData.players[props.userId]);
    return (
      <>
        <AnimatePresence>
          {modalIsOpen && (
            <Modal
              placement={endGameSummary?.placement}
              totalTime={endGameSummary?.totalTime}
              totalGuesses={endGameSummary?.totalGuesses}
              exitMatch={props.exitMatch}
            />
          )}
        </AnimatePresence>

        <motion.div
          exit={{ scale: 0 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex w-full items-center justify-around"
        >
          <div className=" flex w-1/4 flex-wrap justify-around gap-y-2">
            {Object.keys(gameData.players).map(
              (playerId: string, index: number) => {
                const { word, guesses, timer } = gameData.players[playerId];
                if (playerId === props.userId) {
                  return;
                } else if (index % 2 == 0)
                  return (
                    <Opponent
                      word={word}
                      guesses={guesses}
                      id={playerId}
                      key={playerId}
                      timer={timer}
                      numOfOpponents={Object.keys(gameData.players).length / 2}
                    />
                  );
              },
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <AnimatePresence>
                {gameData.gameStarted && !endGame.isSuccess && (
                  <Timer
                    expiryTimestamp={new Date(playerData.timer)}
                    opponent={false}
                    endGame={() => handleEndMatch()}
                  />
                )}{" "}
                {!gameData.gameStarted && (
                  <motion.p
                    exit={{ scale: 0 }}
                    className="font-bold"
                  >{`Loading Players : ${
                    Object.keys(gameData.players).length
                  } of 66`}</motion.p>
                )}
              </AnimatePresence>
              <GameGrid
                guess={guess}
                guesses={playerData?.guesses}
                word={playerData?.word}
                disabled={!gameData.gameStarted}
              />
            </div>

            <Keyboard disabled={!gameData.gameStarted} matches={matches} />
            {!gameData.gameStarted &&
              Object.keys(gameData.players)[0] === props.userId && (
                <button
                  className="rounded-md bg-black p-2 text-xs font-semibold text-white"
                  onClick={() => handleManualStart()}
                >
                  Manual Start
                </button>
              )}
          </div>
          <div className="flex w-1/4 flex-wrap justify-around gap-1">
            {Object.keys(gameData.players).map(
              (playerId: string, index: number) => {
                const { word, guesses, timer } = gameData.players[playerId];
                if (playerId === props.userId) {
                  return;
                } else if (index % 2 !== 0)
                  return (
                    <Opponent
                      word={word}
                      guesses={guesses}
                      id={playerId}
                      key={playerId}
                      timer={timer}
                      numOfOpponents={Object.keys(gameData.players).length / 2}
                    />
                  );
              },
            )}
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
    );
  } else {
    return <p>Loading!</p>;
  }
};

export default PublicGame;
