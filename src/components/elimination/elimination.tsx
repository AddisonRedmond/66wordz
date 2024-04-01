import { GameType } from "@prisma/client";
import useEliminationData, {
  EliminationLobbyData,
  EliminationPlayerData,
  PlayerObject,
} from "~/custom-hooks/useEliminationData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "./word-container";
import GuessContainer from "./guess-container";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useState } from "react";
import PointsContainer from "./points-container";
import Keyboard from "../keyboard";
import EliminationOpponent from "./elimination-opponent";
import LoadingGame from "../loading-game";
import {
  handleIncorrectGuess,
  handleCorrectGuess,
  calculateQualified,
} from "~/utils/elimination";
import AnimateLetter from "../animated-letter";
import { checkSpelling } from "~/utils/survival/surivival";
import RoundTimer from "./round-timer";
import Modal from "../modal";
import NextRoundTimer from "./next-round-timer";
import Confetti from "react-confetti";
import useSound from "use-sound";
import { useIsMobile } from "~/custom-hooks/useIsMobile";
import MobileOpponents from "./mobile-opponents";

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
  const playerData = gameData?.players[userId] as PlayerObject;
  const lobbyData = gameData?.lobbyData as EliminationLobbyData;
  const players: EliminationPlayerData | undefined = gameData?.players;
  const [isSpellCheck, setIsSpellCheck] = useState<boolean>(false);
  const [isIncorrectGuess, setIsIncorrectGuess] = useState<boolean>(false);
  const [guess, setGuess] = useState<string>("");
  const isMobile = useIsMobile();

  const [popSound] = useSound("/sounds/pop-2.mp3", {
    volume: 0.5,
    playbackRate: 1.5,
  });

  const [deleteSound] = useSound("/sounds/delete2.mp3", {
    volume: 0.5,
    playbackRate: 2,
  });

  const handleKeyBoardLogic = (e: KeyboardEvent | string) => {
    if (
      lobbyData.gameStarted === false ||
      playerData?.points >= lobbyData.pointsGoal ||
      lobbyData.winner ||
      lobbyData.nextRoundStartTime
    )
      return;
    const key = typeof e === "string" ? e.toUpperCase() : e.key.toUpperCase();
    if (playerData.points >= lobbyData.pointsGoal) {
      return;
    }
    // if backspace check to make sure guess is not empty
    // check if guess.length is greater than word.length
    // if it is, dont add more letters
    if (key === "BACKSPACE") {
      if (guess.length === 0) return;
      deleteSound();
      setGuess((prev) => prev.slice(0, -1));
    }

    // check key
    // key needs to be one char, A-Z
    // if its not, return
    if (/[a-zA-Z]/.test(key) && key.length === 1 && guess.length < 5) {
      popSound();
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
          lobbyData.pointsGoal,
        );
        setGuess("");
      } else {
        // handle incorrect guess
        handleIncorrectGuess(
          `${gameType}/${lobbyId}/players/${userId}`,
          playerData,
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
        {lobbyData?.nextRoundStartTime && (
          <Modal>
            <NextRoundTimer nextRoundStartTime={lobbyData.nextRoundStartTime} />
          </Modal>
        )}
        {!isMobile && (
          <div className="flex w-1/3 flex-wrap items-center justify-center gap-3 gap-x-1 gap-y-2">
            {players &&
              Object.keys(players).map((playerId: string, index: number) => {
                if (playerId === userId) return;
                if (index % 2 === 0) {
                  return (
                    <EliminationOpponent
                      key={`index-${index}`}
                      opponentCount={Object.keys(players).length}
                      revealIndex={players[playerId]?.revealIndex}
                      points={players[playerId]?.points ?? 0}
                      pointsGoal={lobbyData.pointsGoal ?? 300}
                      initials={players[playerId]?.initials}
                      eliminated={players[playerId]?.eliminated}
                    />
                  );
                }
              })}
          </div>
        )}
        <div className="flex w-1/3 min-w-[370px] flex-col items-center justify-center">
          {!lobbyData.gameStarted ? (
            <div className="mb-5">
              <LoadingGame
                expiryTimestamp={new Date(lobbyData.gameStartTime)}
                lobbyId={lobbyId}
                startGame={() => {}}
                exitMatch={exitMatch}
                playerCount={players ? Object.keys(players).length : 0}
              />
            </div>
          ) : (
            <>
              {playerData.eliminated && (
                <div className="rounded-md border-2 border-black p-2 text-center">
                  <p className="text-xl font-bold">You have been eliminated!</p>
                  <p>You'll get 'em next time!</p>
                </div>
              )}

              {lobbyData.winner === userId && (
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
              )}

              {!playerData.eliminated && !lobbyData.winner && (
                <>
                  <div className="flex h-1/2 flex-col justify-evenly gap-2 text-center">
                    <p className="text-xl font-semibold">
                      {lobbyData.finalRound
                        ? "Final Round"
                        : `Round ${lobbyData.round}`}
                    </p>
                    <WordContainer
                      word={playerData?.word}
                      revealIndex={playerData?.revealIndex}
                    />

                    <div className="flex items-center">
                      <div className="flex h-full flex-col justify-center rounded-l-md border-2 border-zinc-800 bg-zinc-800 px-3 font-semibold text-white">
                        {lobbyData.finalRound ? (
                          <p className="text-2xl ">👑</p>
                        ) : (
                          <>
                            <p>
                              {players
                                ? calculateQualified(
                                    players,
                                    lobbyData.pointsGoal,
                                    lobbyData.totalSpots,
                                  )
                                : "ERROR"}
                            </p>
                            <p>Qualified</p>
                          </>
                        )}
                      </div>

                      <div className="flex h-full w-full flex-col justify-center rounded-r-md border-2 border-zinc-800 px-3">
                        <div>
                          {lobbyData.roundTimer &&
                            !lobbyData.nextRoundStartTime && (
                              <RoundTimer
                                expiryTimeStamp={lobbyData.roundTimer}
                              />
                            )}

                          <div className="flex justify-between text-center font-medium">
                            <p className="text-sm ">Word Value: </p>
                            <div className="flex flex-row justify-center text-lg">
                              <AnimateLetter
                                letters={
                                  playerData?.wordValue < 100
                                    ? `${0}${playerData?.wordValue}`
                                    : playerData?.wordValue
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isMobile && <MobileOpponents userId={userId} opponents={players} pointsGoal={lobbyData.pointsGoal} />}

                    <div className="flex flex-col gap-2">
                      <PointsContainer
                        points={playerData?.points ?? 0}
                        pointsGoal={lobbyData.pointsGoal ?? 300}
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
                  <div className="mt-20 grid w-full place-items-center">
                    <Keyboard
                      disabled={false}
                      handleKeyBoardLogic={handleKeyBoardLogic}
                      matches={playerData?.matches}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {!lobbyData.winner && (
            <button
              onClick={() => exitMatch()}
              className="mt-4 rounded-md bg-zinc-800 p-2 font-semibold text-white transition hover:bg-zinc-700 sm:right-72 sm:top-2 sm:block "
            >
              QUIT
            </button>
          )}
        </div>
        {!isMobile && (
          <div className="flex w-1/3 flex-wrap items-center justify-center gap-3 gap-x-1 gap-y-2">
            {players &&
              Object.keys(players).map((playerId: string, index: number) => {
                if (playerId === userId) return;
                if (index % 2 !== 0) {
                  return (
                    <EliminationOpponent
                      key={index}
                      opponentCount={Object.keys(players).length}
                      revealIndex={players[playerId]?.revealIndex}
                      points={players[playerId]?.points ?? 0}
                      pointsGoal={lobbyData.pointsGoal ?? 300}
                      initials={players[playerId]?.initials}
                      eliminated={players[playerId]?.eliminated}
                    />
                  );
                }
              })}
          </div>
        )}
      </div>
    );
  }
};

export default Elimination;
