import { ref, update } from "firebase/database";

import {
  // EliminationLobbyData,
  EliminationPlayerData,
  EliminationPlayerObject,
} from "~/custom-hooks/useEliminationData";
import { getInitials, getRevealIndex, handleMatched } from "./game";
import { default as FIVE_LETTER_WORDS } from "./words";
import SIX_LETTER_WORDS from "./six-letter-words";
import FOUR_LETTER_WORDS from "./four-letter-words";
import { db } from "./firebase/firebase";
import { GameDetails } from "./types";

const wordLengthLookUp: { [key: number]: number } = {
  1: 4,
  2: 5,
  3: 6,
  5: 7,
};

export const getWordByLength = (length: number) => {
  switch (length) {
    case 4:
      const fourLetterIndex = Math.floor(
        Math.random() * FOUR_LETTER_WORDS.length,
      );
      return FOUR_LETTER_WORDS[fourLetterIndex]!;
    case 5:
      const fiveLetterIndex = Math.floor(
        Math.random() * FOUR_LETTER_WORDS.length,
      );
      return FIVE_LETTER_WORDS[fiveLetterIndex]!;
    case 6:
      const sixLetterIndex = Math.floor(
        Math.random() * FOUR_LETTER_WORDS.length,
      );
      return SIX_LETTER_WORDS[sixLetterIndex]!;

    default:
      return "ERROR";
  }
};

export const createNewEliminationLobby = () => {
  return {
    gameStarted: false,
    round: 1,
    gameStartTime: new Date().getTime() + 30000,
    totalSpots: 0,
    finalRound: false,
    totalPoints: 3,
  };
};

export const joinEliminationLobby = (
  playerId: string,
  fullName?: string | null,
) => {
  const player: EliminationPlayerData = {
    [playerId]: {
      isBot: false,
      initials: getInitials(fullName) ?? "N/A",
      word: getWordByLength(4),
      matches: { full: [], partial: [], none: [] },
      eliminated: false,
      points: 0,
    },
  };

  return player;
};

export const handleCorrectGuess = async (
  playerData: EliminationPlayerObject,
  round: number,
  path: string,
) => {
  // increment player points, clear their matches, get them a new word
  const wordLength = wordLengthLookUp[round] ?? 5;
  if (round) {
    const updatedPlayerData: EliminationPlayerObject = {
      ...playerData,
      points: playerData.points + 1,
      matches: null,
      word: getWordByLength(wordLength),
      revealIndex: [],
    };
    await update(ref(db, path), updatedPlayerData);
  }
};

export const handleIncorrectGuess = async (
  guess: string,
  playerData: EliminationPlayerObject,
  path: string,
) => {
  const updatedPlayerData: EliminationPlayerObject = {
    ...playerData,
    matches: handleMatched(guess, playerData.word, playerData.matches),
    revealIndex: getRevealIndex(playerData.word, guess, playerData.revealIndex),
  };

  await update(ref(db, path), updatedPlayerData);
};

export const calculatePlacement = (
  players: EliminationPlayerData,
  playerId: string,
) => {
  const playerEntries = Object.entries(players);

  // Sort the player entries based on their points in descending order
  const sortedPlayers = playerEntries.sort(
    ([, playerA], [, playerB]) => playerB.points - playerA.points,
  );

  // Find the index of the player with the given playerId
  const playerIndex = sortedPlayers.findIndex(([id]) => id === playerId) + 1;

  // Return the placement of the player if found, otherwise return null
  return playerIndex >= 0 ? playerIndex : 99;
};

export const getQualified = (
  players: EliminationPlayerData,
  pointsGoal: number,
): number => {
  let qualifiedCount = 0;

  for (const playerId in players) {
    if (
      players[playerId]!.points >= pointsGoal &&
      !players[playerId]?.eliminated
    ) {
      qualifiedCount++;
    }
  }

  return qualifiedCount;
};
export const calculateSpots = (round: number, totalPlayers: number): number => {
  // function to total players and bots if bots exist, if bots doesnt exist then return playerPoints.length
  // function to calculate how many players and bots will be qualified for the next round
  // , based off of the total number of players and bots and the round number
  const calculateNumber = () => {
    switch (round) {
      case 1:
        return totalPlayers / 1.4;
      case 2:
        return totalPlayers / 1.5;
      case 3:
        return totalPlayers / 1.8;
      case 4:
        return totalPlayers / 1.8;
      case 5:
        return totalPlayers / 2;
      case 6:
        return totalPlayers / 2;
      default:
        return totalPlayers / 2;
    }
  };

  return Math.floor(calculateNumber());
};

export const validateKey = (key: string): boolean => {
  return /[a-zA-Z]/.test(key);
};

export const eliminationGameDetails: GameDetails = [
  {
    header: "Elimination",
    content: "Only the fastest players will advance to the next round.",
  },
  {
    header: "Elimination",
    content:
      "Round 1: Words have 4 letters. Round 2: Words increase in length. Round 3: Words are the longest and most challenging.",
  },
  {
    header: "Elimination",
    content:
      "The first player to correctly guess their 6-letter word wins the game.",
  },
];
