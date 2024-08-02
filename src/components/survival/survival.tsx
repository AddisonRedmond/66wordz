import { GameType } from "@prisma/client";
import useSurvialData from "../../custom-hooks/useSurvivalData";
import { db } from "~/utils/firebase/firebase";
import WordContainer from "../board-components/word-container";
import {
  findPlayerToAttack,
  handleCorrectGuess,
  handleIncorrectGuess,
  SurvivalPlayerData,
  SurvivalPlayerObject,
} from "~/utils/survival/surivival";
import GuessContainer from "../board-components/guess-container";
import Keyboard from "../board-components/keyboard";
import { useState } from "react";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";

import SurvivalOpponent from "./survival-opponent";
import useSound from "use-sound";
import { ref } from "firebase/database";
import StatusBar from "./status-bar";
import AttackMenu from "./attack-menu";
import GameStarting from "../board-components/game-starting";

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
  const lobbyRef = ref(db, `${gameType}/${lobbyId}`);
  const playerRef = ref(db, `${gameType}/${lobbyId}/players/${userId}`);
  const gameData = useSurvialData(lobbyRef, { userId, lobbyId, gameType });
  const playerData: SurvivalPlayerObject | undefined =
    gameData?.players[userId];

  const [guess, setGuess] = useState("");
  const [attackPosition, setAttackPosition] = useState<AttackPosition>("First");

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
          const playerEliminated = await handleCorrectGuess(
            lobbyRef,
            userId,
            playerData,
            playerToAttack,
            gameData.players[playerToAttack],
          );

          if (playerEliminated) {
            //
          }
        } else {
          // handle incorrect guess
          handleIncorrectGuess(playerRef, playerData, guess);
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

  useOnKeyUp(handleKeyUp, [guess, gameData]);

  const getHalfOfOpponents = (
    isEvenHalf: boolean,
    opponents?: SurvivalPlayerData,
  ) => {
    if (!opponents) {
      return;
    }
    const filteredData: SurvivalPlayerData = {};

    const keys = Object.keys(opponents).filter(
      (id) => id !== userId && !opponents[id]?.eliminated,
    );

    keys.forEach((key, index) => {
      if (opponents[key]) {
        if (isEvenHalf && index % 2 === 0) {
          filteredData[key] = opponents[key];
        } else if (!isEvenHalf && index % 2 !== 0) {
          filteredData[key] = opponents[key];
        }
      }
    });

    return filteredData;
  };

  if (gameData) {
    return (
      <div className="flex w-screen flex-grow justify-around">
        {gameData?.lobbyData.gameStarted ? (
          <>
            <SurvivalOpponent opponents={getHalfOfOpponents(true)} />

            <div className="flex w-1/4 min-w-80 flex-col items-center justify-center gap-y-3 sm:gap-y-8">
              <WordContainer
                word={playerData?.word?.word}
                match={playerData?.revealIndex}
              />

              <AttackMenu
                attackPosition={attackPosition}
                setAttackPosition={setAttackPosition}
              />

              <div className="w-full">
                <StatusBar
                  value={playerData?.shield}
                  color="bg-sky-400"
                  sections={4}
                />
                <StatusBar
                  value={playerData?.shield}
                  color="bg-green-400"
                  sections={2}
                />
              </div>
              <div className="flex w-full flex-col gap-y-2">
                <GuessContainer
                  wordLength={playerData?.word.word.length}
                  word={guess}
                />
                <Keyboard
                  matches={playerData?.word.matches}
                  handleKeyBoardLogic={handleKeyUp}
                  disabled={false}
                />
              </div>
            </div>

            <SurvivalOpponent opponents={getHalfOfOpponents(false)} />
          </>
        ) : (
          <GameStarting expiryTimestamp={gameData?.lobbyData.gameStartTime} />
        )}
      </div>
    );
  }
};

export default Survival;
