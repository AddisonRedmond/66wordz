import { DatabaseReference } from "firebase/database";
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
}

export interface RaceLobbyData extends DefaultLobbyData {
  round: number;
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
    },
  };

  return player;
};

export const getUserPlacement = (players: Record<string, RacePlayerData>) => {
  return Object.entries(players)
    .filter(([_, player]) => !player.eliminated)
    .sort(([, a], [, b]) => b.correctGuesses - a.correctGuesses)
    .map(([id]) => id);
};

export const handleCorrectGuess = (
  userId: string,
  userData: RacePlayerData,
  dbRef: DatabaseReference,
  placement: string[],
) => {
  const updatedUserObject = userData;

  const newWord = handleGetNewWord();
  const { revealIndex, matches } = determineReveal(newWord, 1);

  updatedUserObject.revealIndex = revealIndex;
  updatedUserObject.matches = { full: matches };
  updatedUserObject.correctGuesses++;
  updatedUserObject.word = handleGetNewWord();

  // break users into 5ths,
  // 1 one revealed letter
  // 2 two revealed letters
  // 3 three letters revealed
  // 4 four letters revealed
};

export const handleIncorrectGuess = () => {};
