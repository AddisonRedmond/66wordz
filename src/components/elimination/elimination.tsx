import { GameType } from "@prisma/client";
import useEliminationData from "~/custom-hooks/useEliminationData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "./word-container";
import GuessContainer from "./guess-container";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useEffect, useState } from "react";
import PointsContainer from "./points-container";
import Keyboard from "../keyboard";
import EliminationOpponent from "./elimination-opponent";
import LoadingGame from "../loading-game";
import { handleIncorrectGuess, handleCorrectGuess } from "~/utils/elimination";
import AnimateLetter from "../animated-letter";
import { checkSpelling } from "~/utils/survival/surivival";
import RoundTimer from "./round-timer";
import { api } from "~/utils/api";

type EliminationProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
  exitMatch: () => void;
};

const Elimination: React.FC<EliminationProps> = ({
  lobbyId,
  userId,
  gameType,
  exitMatch,
  ...props
}: EliminationProps) => {
  const gameData = useEliminationData(db, { userId, lobbyId, gameType });
  const playerData = gameData?.players[userId];
  const players = gameData?.players;
  const [isSpellCheck, setIsSpellCheck] = useState<boolean>(false);
  const [isIncorrectGuess, setIsIncorrectGuess] = useState<boolean>(false);
  const [guess, setGuess] = useState<string>("");
  const incrementGamesPlayed = api.getUser.incrementFreeGameCount.useMutation();

  useEffect(() => {
    if (gameData?.lobbyData.gameStarted === true) {
      // increment games played for user
      incrementGamesPlayed.mutate();
    }
  }, [gameData?.lobbyData.gameStarted]);

  const handleKeyBoardLogic = (e: KeyboardEvent | string) => {
    const key = typeof e === "string" ? e.toUpperCase() : e.key.toUpperCase();
    if (playerData!.points >= gameData!.lobbyData.pointsGoal) {
      return;
    }
    // if backspace check to make sure guess is not empty
    // check if guess.length is greater than word.length
    // if it is, dont add more letters
    if (key === "BACKSPACE") {
      if (guess.length === 0) return;
      setGuess((prev) => prev.slice(0, -1));
    }

    // check key
    // key needs to be one char, A-Z
    // if its not, return
    if (/[a-zA-Z]/.test(key) && key.length === 1 && guess.length < 5) {
      setGuess((prev) => prev + key);
    }

    // if key is enter, check if guess is spelled correctly
    // if it is check if guess === word
    // if it does, handle correct guess
    if (key === "ENTER" && guess.length === 5) {
      if (checkSpelling(guess) === false) {
        setIsSpellCheck(true);
        return;
      }
      // spell check here
      if (playerData?.word === guess) {
        // handle correct guess
        setIsIncorrectGuess(true);
        handleCorrectGuess(
          `${gameType}/${lobbyId}/players/${userId}`,
          playerData,
        );
        setGuess("");
      } else {
        // handle incorrect guess
        handleIncorrectGuess(
          `${gameType}/${lobbyId}/players/${userId}`,
          playerData!,
          guess,
        );
        setGuess("");
      }
    }
  };

  useOnKeyUp(handleKeyBoardLogic, [guess, gameData]);
  if (gameData) {
    return (
      <div className="flex w-screen flex-grow justify-center">
        <div className="flex w-1/3 flex-wrap items-center justify-center gap-3 gap-x-1 gap-y-2">
          {players &&
            Object.keys(players).map((playerId: string, index: number) => {
              return (
                <EliminationOpponent
                  key={`index-${index}`}
                  opponentCount={Object.keys(players).length}
                  revealIndex={players[playerId]?.revealIndex}
                  points={players[playerId]?.points ?? 0}
                  pointsGoal={gameData?.lobbyData.pointsGoal ?? 300}
                  initials={players[playerId]?.initials}
                />
              );
            })}
        </div>

        <div className="flex w-1/3 min-w-[370px] flex-col items-center justify-center">
          {!gameData?.lobbyData.gameStarted ? (
            <div className="mb-5">
              <LoadingGame
                expiryTimestamp={new Date(gameData.lobbyData.gameStartTime)}
                lobbyId={lobbyId}
                startGame={() => {}}
                exitMatch={exitMatch}
                playerCount={players ? Object.keys(players).length : 0}
              />
            </div>
          ) : (
            <>
              <div className="flex h-1/2 flex-col justify-evenly text-center">
                <p className="text-xl font-semibold">{`Round ${gameData?.lobbyData.round}`}</p>
                <WordContainer
                  word={playerData?.word}
                  revealIndex={playerData?.revealIndex}
                />

                <div className="flex items-center">
                  <div className="rounded-l-md border-2 border-zinc-800 bg-zinc-800 font-semibold text-white px-3">
                    <p>1st</p>
                    <p>place</p>
                  </div>
                  <div className="h-full w-full flex flex-col px-3 justify-center rounded-r-md border-2 border-zinc-800">
                    <div className="">
                      {gameData.lobbyData.roundTimer && (
                        <RoundTimer
                          expiryTimeStamp={gameData.lobbyData.roundTimer}
                        />
                      )}

                      <div className="flex text-center font-medium justify-between">
                        <p className="text-sm ">Word Value: </p>
                        <div className="flex flex-row justify-center text-lg">
                          <AnimateLetter
                            letters={
                              playerData?.wordValue! < 100
                                ? `${0}${playerData?.wordValue}`
                                : playerData?.wordValue
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <PointsContainer
                    points={playerData?.points ?? 0}
                    pointsGoal={gameData?.lobbyData.pointsGoal ?? 300}
                  />
                  <GuessContainer
                    isSpellCheck={isSpellCheck}
                    setIsSpellCheck={setIsSpellCheck}
                    isIncorrectGuess={isIncorrectGuess}
                    setIsIncorrectGuess={setIsIncorrectGuess}
                    guess={guess}
                  />
                </div>
              </div>
              <Keyboard
                disabled={false}
                handleKeyBoardLogic={handleKeyBoardLogic}
                matches={playerData?.matches}
              />
            </>
          )}

          <button
            onClick={() => exitMatch()}
            className="rounded-md mt-4 bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700 sm:right-72 sm:top-2 sm:block "
          >
            QUIT
          </button>
        </div>
        <div className="flex w-1/3 flex-wrap items-center justify-center gap-3 gap-x-1 gap-y-2">
          {players &&
            Object.keys(players).map((playerId: string, index: number) => {
              return (
                <EliminationOpponent
                  key={index}
                  opponentCount={Object.keys(players).length}
                  revealIndex={players[playerId]?.revealIndex}
                  points={players[playerId]?.points ?? 0}
                  pointsGoal={gameData?.lobbyData.pointsGoal ?? 300}
                  initials={players[playerId]?.initials}
                />
              );
            })}
        </div>
      </div>
    );
  }
};

export default Elimination;
