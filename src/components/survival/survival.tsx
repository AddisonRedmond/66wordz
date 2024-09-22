import { GameType } from "@prisma/client";
import useSurvialData from "../../custom-hooks/useSurvivalData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "../board-components/word-container";
import {
  findPlayerToAttack,
  getGuessTimer,
  handleCorrectGuess,
  handleGuessExpired,
  handleIncorrectGuess,
  SurvivalPlayerObject,
} from "~/utils/survival/surivival";
import GuessContainer from "../board-components/guess-container";
import Keyboard from "../board-components/keyboard";
import { useState } from "react";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { checkSpelling } from "~/utils/spellCheck";
import SurvivalOpponent from "./survival-opponent";
import useSound from "use-sound";
import { ref } from "firebase/database";
import StatusBar from "./status-bar";
import AttackMenu from "./attack-menu";
import GameOver from "../board-components/game-over";
import { useIsMobile } from "~/custom-hooks/useIsMobile";
import MobileMenu from "./mobile-menu";
import CountDownTimer from "../board-components/countdown-timer";
import GameTimer from "./game-timer";
type SurvivalProps = {
  lobbyId: string;
  userId: string;
  gameType: GameType;
};

export type AttackPosition = "First" | "Last" | "Random" | string;

const Survival: React.FC<SurvivalProps> = ({
  lobbyId,
  userId,
  gameType,
}: SurvivalProps) => {
  const isMobile = useIsMobile();

  const lobbyRef = ref(db, `${gameType}/${lobbyId}`);
  const gameData = useSurvialData(lobbyRef);
  const playerData: SurvivalPlayerObject | undefined =
    gameData?.players[userId];

  const [guess, setGuess] = useState("");
  const [spellCheck, setSpellCheck] = useState(false);
  const [attackPosition, setAttackPosition] = useState<AttackPosition>("First");

  const [popSound] = useSound("/sounds/pop-2.mp3", {
    volume: 0.5,
    playbackRate: 1.5,
  });

  const [deleteSound] = useSound("/sounds/delete2.mp3", {
    volume: 1,
    playbackRate: 3,
  });

  const finishSpellCheck = () => {
    setSpellCheck(false);
  };

  const handleSetAttackPosition = (id: string) => {
    setAttackPosition(id);
  };

  const handleSetRandom = () => {
    const players = gameData?.players;
    if (!players) {
      return;
    }

    const nonEliminatedPlayersOrdered: string[] = Object.keys(gameData.players)
      .filter((id) => !players[id]?.eliminated && id !== userId)
      .toSorted(
        (a, b) =>
          players[b]!.health +
          players[b]!.shield -
          (players[a]!.health + players[a]!.shield),
      );

    const randomPlayer =
      nonEliminatedPlayersOrdered[
        Math.floor(Math.random() * nonEliminatedPlayersOrdered.length)
      ];

    if (randomPlayer) {
      setAttackPosition(randomPlayer);
    }
  };

  const handleExpiredGuessTimer = async () => {
    await handleGuessExpired(
      lobbyRef,
      userId,
      playerData,
      gameData?.lobbyData.round,
    );
  };

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
    }

    const handleBackspace = () => {
      if (guess.length === 0) return;
      deleteSound();
      setGuess((prev) => prev.slice(0, -1));
    };

    const handleEnter = async () => {
      // ensure guess length is same length as word
      if (guess.length === playerData.word.word.length) {
        if (!checkSpelling(guess)) {
          setSpellCheck(true);

          return;
        }
        // check if guess is correct
        if (guess === playerData.word.word) {
          const playerToAttack = findPlayerToAttack(
            userId,
            gameData.players,
            attackPosition,
          );

          if (!playerToAttack || !gameData.players[playerToAttack]) {
            // TODO: add check for no player to attack
            return;
          }
          // TODO: create eliminated notifcation, for when you eliminate another player
          const playerEliminated = await handleCorrectGuess(
            lobbyRef,
            userId,
            playerData,
            playerToAttack,
            gameData?.lobbyData.round,
            gameData.players[playerToAttack],
          );
          if (playerEliminated) {
            setAttackPosition("First");
          }
        } else {
          // handle incorrect guess
          handleIncorrectGuess(lobbyRef, playerData, guess, userId);
        }
        setGuess("");
      }
    };

    const handleLetter = (letter: string) => {
      if (guess.length < playerData?.word.word.length) {
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

  const evenIds = Object.keys(gameData?.players ?? {}).filter(
    (playerId: string, index: number) => {
      return (
        index % 2 === 0 &&
        !gameData?.players[playerId]?.eliminated &&
        playerId !== userId
      );
    },
  );

  const oddIds = Object.keys(gameData?.players ?? {}).filter(
    (playerId: string, index: number) => {
      return (
        index % 2 !== 0 &&
        !gameData?.players[playerId]?.eliminated &&
        playerId !== userId
      );
    },
  );

  useOnKeyUp(handleKeyUp, [guess, gameData]);

  if (gameData) {
    return (
      <div className="flex w-screen flex-grow justify-around">
        {gameData?.lobbyData.gameStarted ? (
          <>
            {!isMobile && (
              <SurvivalOpponent
                opponents={gameData.players}
                setAttackPosition={handleSetAttackPosition}
                attackPosition={attackPosition}
                ids={evenIds}
              />
            )}
            <div className="flex w-1/4 min-w-80 flex-col items-center justify-center gap-y-3 sm:gap-y-8">
              <div className="flex w-full flex-col gap-1">
                {playerData?.guessTimer && !gameData.lobbyData?.winner && (
                  <div>
                    <p className="text-sm font-semibold">{`Guess Timer - ${(getGuessTimer(gameData.lobbyData.round) - new Date().getTime()) / 1000} sec`}</p>

                    <GameTimer
                      timer={playerData?.guessTimer}
                      handleExpired={handleExpiredGuessTimer}
                    />
                  </div>
                )}
                <WordContainer
                  word={playerData?.word?.word}
                  match={playerData?.revealIndex}
                  eliminated={playerData?.eliminated}
                  revealAll={gameData.lobbyData?.winner === userId}
                />
              </div>

              {playerData?.eliminated || gameData.lobbyData?.winner ? (
                <GameOver
                  eliminated={playerData?.eliminated}
                  winner={gameData.lobbyData?.winner === userId}
                />
              ) : (
                <>
                  {isMobile ? (
                    <MobileMenu
                      allPlayers={gameData.players}
                      setAttackPosition={handleSetAttackPosition}
                      attackPosition={attackPosition}
                      userId={userId}
                      handleSetRandom={handleSetRandom}
                    />
                  ) : (
                    <AttackMenu
                      attackPosition={attackPosition}
                      setAttackPosition={handleSetAttackPosition}
                      handleSetRandom={handleSetRandom}
                    />
                  )}

                  <div className="w-full">
                    <StatusBar
                      value={playerData?.shield}
                      color="bg-sky-400"
                      sections={4}
                    />
                    <StatusBar
                      value={playerData?.health}
                      color="bg-green-400"
                      sections={2}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-y-2">
                    <GuessContainer
                      wordLength={playerData?.word.word.length}
                      word={guess}
                      spellCheck={spellCheck}
                      finishSpellCheck={finishSpellCheck}
                    />
                    <Keyboard
                      matches={playerData?.word.matches}
                      handleKeyBoardLogic={handleKeyUp}
                      disabled={false}
                    />
                  </div>
                </>
              )}
            </div>

            {!isMobile && (
              <SurvivalOpponent
                ids={oddIds}
                opponents={gameData.players}
                setAttackPosition={handleSetAttackPosition}
                attackPosition={attackPosition}
              />
            )}
          </>
        ) : (
          <CountDownTimer
            expiryTimestamp={gameData?.lobbyData.gameStartTime}
            timerTitle="Game Starting In"
          />
        )}
      </div>
    );
  }
};

export default Survival;
