import {
  // EliminationLobbyData,
  EliminationPlayerData,
  EliminationPlayerObject,
  EliminationPlayerPoints,
} from "~/custom-hooks/useEliminationData";
import { getInitials, handleGetNewWord, handleMatched } from "./game";

export const createNewEliminationLobby = () => {
  return {
    gameStarted: false,
    round: 1,
    gameStartTime: new Date().getTime() + 30000,
    totalSpots: 0,
    finalRound: false,
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
      word: handleGetNewWord(),
      matches: { full: [], partial: [], none: [] },
      revealIndex: [],
      eliminated: false,
    },
  };

  return player;
};

export const handleCorrectGuess = async () => {
  const newWord = handleGetNewWord();
};

const getRevealIndex = (
  word: string,
  guess: string,
  currentRevealedIndex?: number[],
): number[] => {
  const revealIndex = new Set([...(currentRevealedIndex ?? [])]);

  word.split("").forEach((letter, index) => {
    if (letter === guess.split("")[index]) {
      revealIndex.add(index);
    }
  });

  return Array.from(revealIndex);
};

export const handleIncorrectGuess = async () => {
  // get reveal index from function
};

export const calculatePlacement = (
  players: EliminationPlayerData,
  playerPoints: EliminationPlayerPoints,
  playerId: string,
) => {
  // return index of user id

  const sortedPlayers = Object.keys(players)
    .filter((playerId) => {
      return !players[playerId]!.eliminated;
    })
    .sort(
      (a, b) =>
        (playerPoints?.[a]?.points ?? 0) - (playerPoints?.[b]?.points ?? 0),
    );

  // filter out eliminated players

  return sortedPlayers.indexOf(playerId) + 1;
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

export const calculateQualified = (
  pointsGoal: number,
  totalSpots: number,
  playerPoints?: EliminationPlayerPoints,
) => {
  if (playerPoints === undefined) return `0/${totalSpots}`;
  // calculate how many players are at or above the points goal
  const totalQualifiedPlayers = Object.keys(playerPoints).filter(
    (playerId) => (playerPoints?.[playerId]?.points ?? 0) >= pointsGoal,
  );

  return `${totalQualifiedPlayers.length}/${totalSpots}`;
};

export const createEliminationPlayer = (
  fullName: string,
): EliminationPlayerObject => {
  return {
    initials: getInitials(fullName),
    isBot: false,
    word: handleGetNewWord(),
    matches: { full: [], partial: [], none: [] },
    revealIndex: [],
    eliminated: false,
  };
};

export const validateKey = (key: string): boolean => {
  return /[a-zA-Z]/.test(key);
};
