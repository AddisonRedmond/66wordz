import useGameLobbyData from "../custom-hooks/useGameLobbyData"; // Import your custom hook
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { db, handleNextRound } from "~/utils/firebase/firebase";
import GameGrid from "./game-grid";
import { useState } from "react";
import { motion } from "framer-motion";
import Keyboard from "./keyboard";
import WordContainer from "~/elimination/word-container";
import {
  roundQualifiedTable,
  handleCorrectAnswer,
  handleCreateMatchingIndex,
  handleEliminationMatched,
  spellCheck,
  calculatePoints,
} from "~/utils/elimination";
import { updateGuessCountAndMatchingIndex } from "../utils/firebase/firebase";
import Points from "~/elimination/points";
import OpponentsContainer from "~/elimination/opponents-container";
import { ToastContainer, toast } from "react-toastify";
type EliminationProps = {
  lobbyId: string;
  userId: string;
  gameType: "MARATHON" | "ELIMINATION" | "ITEMS";
};

type Matches = {
  fullMatch: string[];
  partialMatch: string[];
  noMatch: string[];
};

type Players = {
  guessCount: number;
  matchingIndex: number[];
}[];

const Elimination: React.FC<EliminationProps> = (props: EliminationProps) => {
  const TARGET_SCORE = 500;
  const gameData = useGameLobbyData(db, props);
  const [guess, setGuess] = useState("");
  const [keyBoardMatches, setKeyBoardMatches] = useState<Matches>({
    fullMatch: [],
    partialMatch: [],
    noMatch: [],
  });
  const notify = () => toast.warn(`${guess} not in word list!`);
  const gamePath = `${props.gameType}/${props.lobbyId}/roundData/${props.userId}`;

  const calulateQualifiedSpots = () => {};

  const handleQualified = (points: number) => {
    const qualifiedPlayers: string[] = [];
    console.log(points);
    Object.keys(gameData?.playerPoints).forEach((player: string) => {
      if (player === props.userId && points >= TARGET_SCORE) {
        qualifiedPlayers.push(player);
      } else if (gameData?.playerPoints?.[player]?.points >= TARGET_SCORE) {
        qualifiedPlayers.push(player);
      }
    });

    console.log(qualifiedPlayers);
    // if playerId is part of qualifiedPlayers list, disable them from playing

    if (
      qualifiedPlayers.length >= Math.ceil(gameData?.playerPoints.length / 2)
    ) {
      const qualifiedPlayersObject: { [keyof: string]: { points: number } } =
        {};
      qualifiedPlayers.forEach((playerId: string) => {
        qualifiedPlayersObject[playerId] = { points: 0 };
      });
      handleNextRound(
        `${props.lobbyId}`,
        gameData.lobbyData.round + 1,
        qualifiedPlayersObject,
      );
    } else {
    }

    // if gameData.qualified <= remainingSpots
    // add player gameData.qualified
    // else end round,
    // set(db,ref) === gameData.qualified
  };
  // main logic for game
  const handleKeyUp = async (e: KeyboardEvent) => {
    const { gameStarted, word, round } = gameData.lobbyData;
    const { guessCount = 0, matchingIndex = [] } =
      gameData?.roundData?.[props.userId] || {};

    const { points = 0 } = gameData?.playerPoints?.[props.userId] || [];
    if (!gameStarted) {
      return;
    }

    if (e.key === "Backspace" && guess.length > 0) {
      setGuess((prevGuess) => prevGuess.slice(0, -1));
    } else if (e.key === "Enter") {
      if (!spellCheck(guess)) {
        notify();
        return;
      }

      // check if guess matches word
      if (guess === word) {
        await handleCorrectAnswer(
          `ELIMINATION/${props.lobbyId}/playerPoints/${props.userId}`,
          guessCount,
          points,
          props.lobbyId,
        );
        setGuess("");
        setKeyBoardMatches({
          fullMatch: [],
          partialMatch: [],
          noMatch: [],
        });
        handleQualified(
          calculatePoints(
            guessCount,
            gameData?.playerPoints?.[props.userId].points,
          ),
        );

        return;
      }
      // if it doesnt, increment number of guesses,
      else if (guess !== word) {
        // highlight matching letters, highlight semi-matching letters
        setKeyBoardMatches(
          handleEliminationMatched(guess, word, keyBoardMatches),
        );
        updateGuessCountAndMatchingIndex(
          gamePath,
          guessCount + 1,
          handleCreateMatchingIndex(guess, word, matchingIndex),
        );
        setGuess("");
      }
    } else if (
      /[a-zA-Z]/.test(e.key) &&
      e.key.length === 1 &&
      guess.length < 5
    ) {
      setGuess((prevGuess) => `${prevGuess}${e.key}`.toUpperCase());
    }
  };

  const getHalfOfOpponents = (evenOdd: "even" | "odd") => {
    if (evenOdd === "even") {
      return Object.keys(gameData?.playerPoints || {})
        .filter((_, index) => index % 2 === 0)
        .map((playerId) => ({
          playerId: playerId,
          playerData: gameData?.roundData?.[playerId],
          points: gameData.playerPoints?.[playerId].points,
        }))
        .filter((opponent) => opponent.playerId !== props.userId);
    } else {
      return Object.keys(gameData?.playerPoints || {})
        .filter((_, index) => index % 2 !== 0)
        .map((playerId) => ({
          playerId: playerId,
          playerData: gameData?.roundData?.[playerId],
          points: gameData.playerPoints?.[playerId].points,
        }))
        .filter((opponent) => opponent.playerId !== props.userId);
    }
  };
  useOnKeyUp(handleKeyUp, [guess, gameData]);

  if (gameData) {
    const { gameStarted, word } = gameData.lobbyData;
    const { guessCount = 0, matchingIndex = [] } =
      gameData?.roundData?.[props.userId] || {};
    const { points = 0 } = gameData?.playerPoints?.[props.userId] || [];
    const guesses: string[] = gameData?.players || [];
    const isDisabled = () => {
      if (gameData?.playerPoints?.[props.userId].points >= TARGET_SCORE) {
        return true;
      } else if (!gameStarted) {
        return true;
      }
      return false;
    }; 
    return (
      <>
        <ToastContainer
          position="bottom-center"
          autoClose={1000}
          limit={3}
          newestOnTop={false}
          theme="dark"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="flex w-full items-center justify-evenly"
        >
          <OpponentsContainer
            players={getHalfOfOpponents("even")}
            word={word}
          />
          <div className="flex  flex-col items-center gap-4">
            <WordContainer word={word} matchingIndex={matchingIndex} />
            <div className="flex flex-col gap-3">
              <Points
                totalPoints={points}
                pointsTarget={TARGET_SCORE}
                showPoints={true}
              />
              <GameGrid
                guess={guess}
                guesses={guesses}
                word={word}
                disabled={isDisabled()}
                rows={1}
              />
            </div>

            <Keyboard disabled={isDisabled()} matches={keyBoardMatches} />
          </div>
          <OpponentsContainer players={getHalfOfOpponents("odd")} word={word} />
        </motion.div>
      </>
    );
  } else {
    return <p>Loading!</p>;
  }
};

export default Elimination;
