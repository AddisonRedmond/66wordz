import { GameType } from "@prisma/client";
import useEliminationData, {
  EliminationPlayerData,
  EliminationPlayerObject,
} from "~/custom-hooks/useEliminationData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "../board-components/word-container";
import Points from "./points";
import GameStatus from "../board-components/game-status";
import GuessContainer from "../board-components/guess-container";
import Keyboard from "../board-components/keyboard";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useState } from "react";
import useSound from "use-sound";
import {
  getQualified,
  handleCorrectGuess,
  handleIncorrectGuess,
} from "~/utils/elimination";
import EliminationOpponent from "./elimination-opponent";
import GameStarting from "../board-components/countdown-timer";
import { useIsMobile } from "~/custom-hooks/useIsMobile";
import MobileOpponents from "./mobile-opponents";
import Modal from "../modal";
import Intermission from "./intermission";
import Eliminated from "../board-components/eliminated";
import Winner from "../board-components/winner";
import { checkSpelling } from "~/utils/spellCheck";
import GameInfoContainer from "../board-components/game-info-container";

type EliminationProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
};

const Elimination: React.FC<EliminationProps> = ({
  lobbyId,
  userId,
  gameType,
}: EliminationProps) => {
  const gameData = useEliminationData(db, { lobbyId, gameType });
  const isMobile = useIsMobile();
  const [spellCheck, setSpellCheck] = useState(false);

  const finishSpellCheck = () => {
    setSpellCheck(false);
  };

  const playerData: EliminationPlayerObject | undefined =
    gameData?.players?.[userId];

  const [guess, setGuess] = useState("");

  const [popSound] = useSound("/sounds/pop-2.mp3", {
    volume: 0.5,
    playbackRate: 1.5,
  });

  const [deleteSound] = useSound("/sounds/delete2.mp3", {
    volume: 0.5,
    playbackRate: 3,
  });

  const handleKeyUp = (e: KeyboardEvent | string) => {
    const key = typeof e === "string" ? e.toUpperCase() : e.key.toUpperCase();
    // only run function if player isn't eliminated and if they dont have full points

    // conditions to ensure the player should be guessing
    if (!playerData || !gameData) {
      console.error("no player data");
      return;
    } else if (
      playerData?.eliminated ||
      playerData?.points >= gameData?.lobbyData.totalPoints
    ) {
      console.warn("player already qualified");
      return;
    } else if (!gameData.lobbyData.gameStarted) {
      console.warn("Game hasn't started yet");
      return;
    } else if (!/[a-zA-Z]/.test(key)) {
      return;
    } else if (gameData.lobbyData?.winner) {
      console.warn("Somebody already won");
      return;
    } else if (gameData.lobbyData.nextRoundStartTime) {
      return;
    }

    const handleBackspace = () => {
      if (guess.length === 0) return;
      deleteSound();
      setGuess((prev) => prev.slice(0, -1));
    };

    const handleEnter = () => {
      // ensure guess length is same length as word
      if (guess.length === playerData.word.length) {
        // check if guess is correct
        if (!checkSpelling(guess)) {
          setSpellCheck(true);

          return;
        }
        if (guess === playerData.word) {
          handleCorrectGuess(
            playerData,
            gameData.lobbyData.round,
            `${gameType}/${lobbyId}/players/${userId}`,
          );
        } else {
          // handle incorrect guess
          handleIncorrectGuess(
            guess,
            playerData,
            `${gameType}/${lobbyId}/players/${userId}`,
          );
        }
        setGuess("");
      }
    };

    const handleLetter = (letter: string) => {
      if (guess.length < playerData?.word.length) {
        popSound();
        setGuess((prev) => prev + letter);
      }
    };

    switch (key) {
      case "BACKSPACE":
        handleBackspace();
        break;
      case "ENTER":
        handleEnter();
        break;
      default:
        if (key.length === 1) {
          handleLetter(key);
        }
        break;
    }
  };

  useOnKeyUp(handleKeyUp, [guess, gameData]);

  const getHalfOfOpponents = (
    isEven: boolean,
    opponents?: EliminationPlayerData,
  ) => {
    if (!opponents) {
      return;
    }
    const filteredData: EliminationPlayerData = {};
    const keys = Object.keys(opponents).filter((id) => id !== userId);

    keys.forEach((key, index) => {
      if (opponents[key]) {
        if (isEven && index % 2 === 0) {
          filteredData[key] = opponents[key];
        } else if (!isEven && index % 2 !== 0) {
          filteredData[key] = opponents[key];
        }
      }
    });

    return filteredData;
  };
  if (gameData) {
    return (
      <div className="flex w-screen flex-grow justify-center">
        {gameData.lobbyData?.nextRoundStartTime && (
          <Modal>
            <Intermission
              nextRoundStartTime={gameData.lobbyData.nextRoundStartTime}
            />
          </Modal>
        )}
        {!isMobile && (
          <EliminationOpponent
            pointsGoal={gameData?.lobbyData.totalPoints}
            opponents={getHalfOfOpponents(true, gameData?.players)}
            wordLength={playerData?.word.length}
          />
        )}
        {gameData?.lobbyData.gameStarted ? (
          <>
            {/* opponets left side */}

            {/* hidden if game not started || if next round timer hasn't expired*/}
            <div className="flex w-1/4 min-w-80 flex-col items-center justify-center gap-y-3">
              {gameData.lobbyData.roundTimer &&
                !gameData.lobbyData.nextRoundStartTime &&
                !gameData.lobbyData.winner && (
                  <GameInfoContainer>
                    <GameStatus
                      qualified={getQualified(
                        gameData.players,
                        gameData.lobbyData.totalPoints,
                      )}
                      endTime={gameData.lobbyData.roundTimer}
                      totalSpots={gameData.lobbyData.totalSpots}
                      round={gameData.lobbyData.round}
                    />
                  </GameInfoContainer>
                )}
              {!playerData?.eliminated &&
                gameData.lobbyData.winner !== userId && (
                  <>
                    <WordContainer
                      word={playerData?.word}
                      match={playerData?.revealIndex}
                    />
                    <Points
                      large={true}
                      pointsGoal={gameData?.lobbyData.totalPoints}
                      totalPoints={playerData?.points}
                    />
                  </>
                )}
              {isMobile && (
                <MobileOpponents
                  opponents={gameData.players}
                  userId={userId}
                  pointsGoal={8}
                />
              )}
              <div className="flex w-full flex-col gap-y-2">
                {!playerData?.eliminated &&
                  gameData.lobbyData.winner !== userId && (
                    <>
                      <GuessContainer
                        word={guess}
                        wordLength={playerData?.word.length}
                        spellCheck={spellCheck}
                        finishSpellCheck={finishSpellCheck}
                      />
                      <Keyboard
                        disabled={false}
                        handleKeyBoardLogic={handleKeyUp}
                        matches={playerData?.matches}
                      />
                    </>
                  )}
                {playerData?.eliminated && <Eliminated />}
                {gameData.lobbyData.winner === userId && <Winner />}
              </div>
            </div>

            {/* opponents right side */}
          </>
        ) : (
          <GameStarting
            expiryTimestamp={gameData?.lobbyData.gameStartTime}
            timerTitle="Game Starting In"
          />
        )}
        {!isMobile && (
          <EliminationOpponent
            pointsGoal={gameData?.lobbyData.totalPoints}
            opponents={getHalfOfOpponents(false, gameData?.players)}
            wordLength={playerData?.word.length}
          />
        )}
      </div>
    );
  }
};

export default Elimination;
