import { GameType } from "@prisma/client";
import useEliminationData from "~/custom-hooks/useEliminationData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "./word-container";
import GuessContainer from "./guess-container";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useState } from "react";
import PointsContainer from "./points-container";
import Keyboard from "../keyboard";
import EliminationOpponent from "./elimination-opponent";
import LoadingGame from "../loading-game";
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
  const [guess, setGuess] = useState<string>("");

  const handleKeyBoardLogic = (event: any) => {
    // if backspace check to make sure guess is not empty
    
    // check if guess.length is greater than word.length
    // if it is, dont add more letters

    // check key
    // key needs to be one char, A-Z
    // if its not, return

    // if key is enter, check if guess is spelled correctly
    // if it is check if guess === word
    // if it does, handle correct guess

    // if it doesnt, handle incorrect guess

    if (event.key === "Backspace") {
      setGuess((prev) => prev.slice(0, -1));
    } else if (event.key === "Enter") {
      setGuess("");
    } else if (event.key.length === 1) {
      setGuess((prev) => prev + event.key);
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
                />
              );
            })}
        </div>

        <div className="flex w-1/3 min-w-[370px] flex-col items-center justify-center">
          {!gameData?.lobbyData.gameStarted ? (
            <div className="mb-5">
              <LoadingGame
                expiryTimestamp={new Date(gameData.lobbyData.gameStartTimer)}
                lobbyId={lobbyId}
                startGame={() => {}}
                exitMatch={exitMatch}
                playerCount={players ? Object.keys(players).length : 0}
              />
            </div>
          ) : (
            <>
              {/* word to guess */}
              <div className="flex h-1/2 flex-col justify-evenly text-center">
                <p className="text-xl font-semibold">{`Round ${gameData?.lobbyData.round}`}</p>
                <WordContainer
                  word={playerData?.word}
                  revealIndex={playerData?.revealIndex}
                />
                {/* game details n stuff */}
                {/* points */}
                {/* word youre guessing input*/}
                <div className="flex justify-between">
                  <p className="font-semibold">1st place</p>
                  <div className="text-center font-semibold">
                    <p>Time Left</p>
                    <p>3:00</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <PointsContainer
                    points={playerData?.points ?? 0}
                    pointsGoal={gameData?.lobbyData.pointsGoal ?? 300}
                  />
                  <GuessContainer guess={guess} />
                </div>
                {/* keyboard */}
                {/* opponents */}
              </div>
              <Keyboard
                disabled={false}
                handleKeyBoardLogic={handleKeyBoardLogic}
              />
            </>
          )}

          <button
            onClick={() => exitMatch()}
            className="rounded-md bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700 sm:right-72 sm:top-2 sm:block "
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
                />
              );
            })}
        </div>
      </div>
    );
  }
};

export default Elimination;
