import { GameType } from "@prisma/client";
import { ref } from "firebase/database";
import useGameData from "~/custom-hooks/useGameData";
import { db } from "~/utils/firebase/firebase";
import {
  handleCorrectMarathonGuess,
  handleIncorrectMarathonGuess,
  lifeTimerIndex,
  MarathonGameData,
  marathonGameDetails,
  MarathonPlayerData,
} from "~/utils/marathon";
import Keyboard from "../board-components/keyboard";
import WordContainer from "../board-components/word-container";
import GuessContainer from "../board-components/guess-container";
import MarathonOpponents from "./marathon-opponents";
import { useState } from "react";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { checkSpelling } from "~/utils/spellCheck";
import CountDownTimer from "../board-components/countdown-timer";
import MarathonGameInfo from "./marathon-game-info";
import Winner from "../board-components/winner";

type MarathonProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
};
const Marathon: React.FC<MarathonProps> = ({ lobbyId, userId, gameType }) => {
  const lobbyRef = ref(db, `${gameType}/${lobbyId}`);
  const gameData = useGameData<MarathonGameData>(lobbyRef);
  const playerData = gameData?.players?.[userId];
  const [guess, setGuess] = useState("");

  const handleKeyUp = (e: KeyboardEvent | string) => {
    const key = typeof e === "string" ? e.toUpperCase() : e.key.toUpperCase();

    // conditions to ensure the player should be guessing
    if (!playerData || !gameData) {
      console.error("no player data");
      return;
    } else if (playerData?.eliminated) {
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
    }

    const handleBackspace = () => {
      if (guess.length === 0) return;
      setGuess((prev) => prev.slice(0, -1));
    };

    const handleEnter = () => {
      // ensure guess length is same length as word
      if (guess.length === playerData.word.length) {
        // check if guess is correct
        if (!checkSpelling(guess)) {
          return;
        }
        if (guess === playerData.word) {
          // get current placement
          handleCorrectMarathonGuess(
            lobbyRef,
            userId,
            playerData,
            gameData.timers[userId]!,
            gameData.lobbyData.round,
          );
        } else {
          // handle incorrect guess
          handleIncorrectMarathonGuess(lobbyRef, userId, playerData, guess);
        }
        setGuess("");
      }
    };

    const handleLetter = (letter: string) => {
      if (guess.length < playerData?.word.length) {
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

  // if playerData is undefined and game started is true, error boundary

  // TODO: make a custom return function, that either returns an error like this or returns the component
  if ((gameData?.lobbyData.gameStarted && !playerData) || !gameData) {
    return <div>Something weird happened. I would leave and try again</div>;
  }

  const getHalf = (isEven: boolean) => {
    // this should run if there are players in the db
    if (!gameData?.players) {
      return;
    }
    const players: Record<string, MarathonPlayerData> = {};
    Object.keys(gameData.players).forEach((id: string, index: number) => {
      const player = gameData.players?.[id];
      if (
        id !== userId &&
        player &&
        !player.eliminated &&
        (isEven ? index % 2 === 0 : index % 2 !== 0)
      ) {
        players[id] = {
          ...player,
        };
      }
    });

    return players;
  };

  return (
    <div className="flex h-full w-full justify-evenly">
      <MarathonOpponents
        opponents={getHalf(true)}
        lifeTimers={gameData.timers}
      />
      {gameData.lobbyData.gameStarted ? (
        <div className="flex h-full w-1/4 flex-col justify-center gap-4">
          {gameData.lobbyData.winner === userId && <Winner />}
          {gameData.timers[userId] && !gameData.lobbyData.winner && (
            <MarathonGameInfo
              additionalTime={lifeTimerIndex[gameData.lobbyData.round - 1]}
              remainingGuesses={6 - (playerData?.incorrectGuessCount ?? 0)}
              endTime={gameData.timers[userId]}
            />
          )}

          <WordContainer
            word={playerData?.word}
            match={playerData?.revealIndex}
          />
          <GuessContainer word={guess} wordLength={5} />
          <Keyboard
            matches={playerData?.matches}
            handleKeyBoardLogic={handleKeyUp}
            disabled={!gameData.lobbyData.gameStarted}
          />
        </div>
      ) : (
        <CountDownTimer
          expiryTimestamp={gameData?.lobbyData.gameStartTime}
          timerTitle="Game Starting In"
          gameDetails={marathonGameDetails}
        />
      )}

      <MarathonOpponents
        opponents={getHalf(false)}
        lifeTimers={gameData.timers}
      />
    </div>
  );
};

export default Marathon;
