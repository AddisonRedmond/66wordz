import { child, DatabaseReference, update } from "firebase/database";
import {
  handleGetNewWord,
  DefaultPlayerData,
  DefaultLobbyData,
  getInitials,
  determineReveal,
} from "./game";
export interface RacePlayerData extends DefaultPlayerData {
  eliminated: boolean;
  correctGuesses: number;
  totalGuesses: number;
}

export interface RaceLobbyData extends DefaultLobbyData {
  round: number;
  roundTimer: number;
}

export type RaceGameData = {
  lobbyData: RaceLobbyData;
  players: Record<string, RacePlayerData>;
};

export const createNewRaceLobby = () => {
  return {
    gameStarted: false,
    round: 1,
    gameStartTime: new Date().getTime() + 30000,
    roundTimer: new Date().getTime() + 130000,
  };
};

export const joinRaceLobby = (playerId: string, fullName?: string | null) => {
  const player: Record<string, RacePlayerData> = {
    [playerId]: {
      initials: getInitials(fullName) ?? "N/A",
      word: handleGetNewWord(),
      matches: { full: [], partial: [], none: [] },
      eliminated: false,
      correctGuesses: 0,
      totalGuesses: 0,
    },
  };

  return player;
};

export const getUserPlacement = (
  userId: string,
  players?: Record<string, RacePlayerData>,
) => {
  if (!players) {
    return { userPlacement: 100, remainingPlayers: 1, sortedPlayers: [""] };
  }
  const sortedPlayers = Object.entries(players)
    .filter(([, player]) => !player.eliminated)
    .sort(([, a], [, b]) => {
      if (b.correctGuesses !== a.correctGuesses) {
        return b.correctGuesses - a.correctGuesses;
      }
      return a.totalGuesses - b.totalGuesses; // Fallback to totalGuesses
    })
    .map(([id]) => id);

  return {
    userPlacement: sortedPlayers.indexOf(userId),
    remainingPlayers: sortedPlayers.length,
    sortedPlayers,
  };
};
export const handleCorrectGuess = (
  userId: string,
  userData: RacePlayerData,
  dbRef: DatabaseReference,
  placement: { placement: number; remainingPlayers: number },
) => {
  const updatedUserObject = userData;

  placement;

  const newWord = handleGetNewWord();
  const { revealIndex, matches } = determineReveal(newWord, 1);

  updatedUserObject.revealIndex = revealIndex;
  updatedUserObject.matches = { full: matches };
  updatedUserObject.correctGuesses++;
  updatedUserObject.word = newWord;

  const playersRef = child(dbRef, "players");

  update(playersRef, { [userId]: updatedUserObject });
  // break users into 5ths,
  // 1 one revealed letter
  // 2 two revealed letters
  // 3 three letters revealed
  // 4 four letters revealed
};

export const handleIncorrectGuess = () => {
  console.log("TEST");
};
