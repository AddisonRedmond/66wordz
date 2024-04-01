import { ref, set, update } from "firebase/database";
import { db } from "./firebase/firebase";
import {
  EliminationLobbyData,
  EliminationPlayerData,
  PlayerObject,
} from "~/custom-hooks/useEliminationData";
import { getInitials, handleGetNewWord, handleMatched } from "./game";

export const createNewEliminationLobby = async (lobbyId: string) => {
  const lobbyData: EliminationLobbyData = {
    gameStarted: false,
    round: 1,
    gameStartTime: new Date().getTime() + 30000,
    pointsGoal: 300,
    roundTimer: new Date().getTime() + 180000,
    totalSpots: 0,
    finalRound: false,
  };
  await set(ref(db, `ELIMINATION/${lobbyId}`), {
    lobbyData: lobbyData,
  });
};

export const joinEliminationLobby = async (
  playerId: string,
  lobbyId: string,
  userName: string,
) => {
  const player: EliminationPlayerData = {
    [playerId]: {
      points: 0,
      isBot: false,
      initials: getInitials(userName),
      word: handleGetNewWord(5),
      wordValue: 100,
      matches: { full: [], partial: [], none: [] },
      revealIndex: [],
      eliminated: false,
    },
  };

  await update(ref(db, `ELIMINATION/${lobbyId}/players/`), {
    ...player,
  });
};

export const handleCorrectGuess = async (
  path: string,
  playerObject: PlayerObject,
  pointsGoal: number,
) => {
  const newWord = handleGetNewWord(5);

  await update(ref(db, path), {
    ...playerObject,
    word: newWord,
    wordValue: 100,
    points:
      playerObject.wordValue + playerObject.points >= pointsGoal
        ? pointsGoal
        : playerObject.wordValue + playerObject.points,
    matches: {
      full: [],
      partial: [],
      none: [],
    },
    revealIndex: [],
  });
};

const getRevealIndex = (
  word: string,
  guess: string,
  currentRevealedIndex?: number[],
): number[] => {
  const revealIndex: Set<number> = new Set([...(currentRevealedIndex ?? [])]);

  console.log(word, guess);

  word.split("").forEach((letter, index) => {
    if (letter === guess.split("")[index]) {
      console.log(index);
      revealIndex.add(index);
    }
  });

  return Array.from(revealIndex);
};

export const handleIncorrectGuess = async (
  path: string,
  playerObject: PlayerObject,
  guess: string,
) => {
  // get reveal index from function
  const revealIndex = getRevealIndex(
    playerObject.word,
    guess,
    playerObject?.revealIndex,
  );

  const newWordValue = Math.max(20, playerObject.wordValue - 5);

  const matches = handleMatched(guess, playerObject.word, playerObject.matches);

  await update(ref(db, path), {
    ...playerObject,
    revealIndex: revealIndex,
    wordValue: newWordValue,
    matches: {
      ...matches,
    },
  });
};

export const calculatePlacement = (
  players: EliminationPlayerData,
  playerId: string,
) => {
  // return index of user id

  const sortedPlayers = Object.keys(players)
    .filter((playerId) => {
      return !players[playerId]!.eliminated;
    })
    .sort((a, b) => players[b]!.points - players[a]!.points);

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
  players: EliminationPlayerData,
  pointsGoal: number,
  totalSpots: number,
) => {
  // calculate how many players are at or above the points goal
  const totalQualifiedPlayers = Object.keys(players).filter(
    (playerId) => players[playerId]!.points >= pointsGoal,
  );

  return `${totalQualifiedPlayers.length}/${totalSpots}`;
};
