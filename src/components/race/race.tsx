import { GameType } from "@prisma/client";
import { ref } from "firebase/database";
import useGameData from "~/custom-hooks/useGameData";
import { db } from "~/utils/firebase/firebase";
import {
  RaceGameData,
  calculateNumberOfPlayersToEliminate,
  getUserPlacement,
  handleCorrectGuess,
  handleIncorrectGuess,
  raceGameDetails,
} from "~/utils/race";
import GuessContainer from "../board-components/guess-container";
import WordContainer from "../board-components/word-container";
import Keyboard from "../board-components/keyboard";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useEffect, useState } from "react";
import { checkSpelling } from "~/utils/spellCheck";
import GameInfo from "./game-info";
import RaceOpponents from "./race-opponents";
import CountDownTimer from "../board-components/countdown-timer";
import Eliminated from "../board-components/eliminated";
import Winner from "../board-components/winner";
import GameInfoContainer from "../board-components/game-info-container";

type RaceProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
};

const Race: React.FC<RaceProps> = ({ lobbyId, userId, gameType }) => {
  const lobbyRef = ref(db, `${gameType}/${lobbyId}`);
  const gameData = useGameData<RaceGameData>(lobbyRef);
  const [, setSpellCheck] = useState(false);
  // fix the placement issue
  const [placement, setPlacement] = useState({
    placement: 0,
    remainingPlayers: 0,
    sortedPlayers: [""],
  });
  const [guess, setGuess] = useState("");
  const playerData = gameData?.players?.[userId];

  const handleKeyUp = (e: KeyboardEvent | string) => {
    const key = typeof e === "string" ? e.toUpperCase() : e.key.toUpperCase();
    // only run function if player isn't eliminated and if they dont have full points

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
          setSpellCheck(true);

          return;
        }
        if (guess === playerData.word) {
          // get current placement
          handleCorrectGuess(userId, playerData, lobbyRef, placement);
        } else {
          // handle incorrect guess
          handleIncorrectGuess({ [userId]: playerData }, guess, lobbyRef);
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

  const getHalf = (isEven: boolean) => {
    // this should run if there are players in the db
    if (!gameData?.players) {
      console.log("no players");
      return;
    }
    return Object.keys(gameData.players).filter((id: string, index: number) => {
      const player = gameData.players[id];
      return (
        id !== userId && // Exclude the user's ID
        player && // Ensure player exists
        !player.eliminated && // Filter out eliminated players
        (isEven ? index % 2 === 0 : index % 2 !== 0) // Filter by even/odd index
      );
    });
  };

  useEffect(() => {
    if (gameData?.players) {
      const { userPlacement, remainingPlayers, sortedPlayers } =
        getUserPlacement(userId, gameData?.players);
      setPlacement({
        placement: userPlacement,
        remainingPlayers,
        sortedPlayers,
      });
    }
  }, [gameData]);
  // TODO: Add final round logic and notification

  const isAtRisk = () => {
    if (!gameData?.players) return false;
    return (
      placement.placement <
      placement.remainingPlayers -
        calculateNumberOfPlayersToEliminate(gameData.players)
    );
  };

  if (gameData) {
    return (
      <div className="flex w-full flex-grow justify-center">
        <RaceOpponents
          opponents={gameData.players}
          opponentIds={getHalf(true)}
        />
        {gameData.lobbyData.gameStarted ? (
          <>
            {/* main content */}
            <div className="flex w-11/12 min-w-80 flex-col items-center justify-center gap-y-3 sm:w-1/4 sm:gap-y-8">
              {/* make the info portion into its own component */}

              {!!gameData?.lobbyData?.roundTimer && !playerData?.eliminated && (
                <GameInfoContainer>
                  <GameInfo
                    placement={placement.placement}
                    correctGuesses={playerData?.correctGuesses}
                    guesses={playerData?.totalGuesses}
                    roundTimer={gameData.lobbyData.roundTimer}
                    isAtRisk={isAtRisk()}
                  />
                </GameInfoContainer>
              )}
              <div className="flex w-full flex-col gap-y-2">
                {gameData.lobbyData.winner === userId &&
                  !playerData?.eliminated && <Winner />}
                {playerData?.eliminated && <Eliminated />}

                {!playerData?.eliminated && !gameData.lobbyData.winner && (
                  <>
                    <WordContainer
                      word={playerData?.word}
                      match={playerData?.revealIndex}
                    />
                    <GuessContainer word={guess} wordLength={5} />
                    <Keyboard
                      disabled={!gameData.lobbyData.gameStarted}
                      handleKeyBoardLogic={handleKeyUp}
                      matches={playerData?.matches}
                    />
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <CountDownTimer
            expiryTimestamp={gameData?.lobbyData.gameStartTime}
            timerTitle="Game Starting In"
            gameDetails={raceGameDetails}
          />
        )}
        <RaceOpponents
          opponents={gameData.players}
          opponentIds={getHalf(false)}
        />
      </div>
    );
  }
};

export default Race;
