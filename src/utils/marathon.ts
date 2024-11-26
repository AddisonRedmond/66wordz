import { DatabaseReference, child, update } from "firebase/database";
import {
  DefaultLobbyData,
  DefaultPlayerData,
  getInitials,
  handleGetNewWord,
  handleMatched,
} from "./game";

export interface MarathonLobbyData extends DefaultLobbyData {
  round: number;
}

export interface MarathonPlayerData extends DefaultPlayerData {
  lifeTimer?: number;
  correctGuessCount: number;
  incorrectGuessCount: number;
}

export type MarathonGameData = {
  lobbyData: MarathonLobbyData;
  players: Record<string, MarathonPlayerData>;
};

export const marathonLobbyData: MarathonLobbyData = {
  gameStarted: false,
  gameStartTime: new Date().getTime() + 30000,
  round: 1,
};

export const joinMarathonLobby = (userId: string, fullName: string | null) => {
  const playerData: Record<string, MarathonPlayerData> = {
    [userId]: {
      initials: fullName ? getInitials(fullName) : "N/A",
      word: handleGetNewWord(),
      matches: { full: [], partial: [], none: [] },
      correctGuessCount: 0,
      eliminated: false,
      incorrectGuessCount: 0,
    },
  };

  return playerData;
};

const lifeTimerIndex = [30, 25, 20, 15, 10, 5];

const mutateCorrectGuessData = (
  userData: MarathonPlayerData,
  round: number,
) => {
  const lifeTime = lifeTimerIndex[round] ?? 15;
  return {
    ...userData,
    correctGuessCount: userData.correctGuessCount + 1,
    // TODO: set a max time. Math.min(being 3 mins probably)
    incorrectGuessCount: 0,
    lifeTimer: userData.lifeTimer + lifeTime,
    matches: null,
    word: handleGetNewWord(),
  };
};

const mutateIncorrectGuessData = (
  userData: MarathonPlayerData,
  guess: string,
) => {
  return {
    ...userData,
    // TODO: set a max time. Math.min(being 3 mins probably)
    incorrectGuessCount: userData.incorrectGuessCount + 1,
    matches: handleMatched(guess, userData.word, userData.matches),
    word: handleGetNewWord(),
  };
};

export const handleCorrectMarathonGuess = async (
  lobbyRef: DatabaseReference,
  userId: string,
  userData: MarathonPlayerData,
  round: number,
) => {
  const userPath = child(lobbyRef, `/players/${userId}`);

  await update(userPath, mutateCorrectGuessData(userData, round));
};

export const handleIncorrectMarathonGuess = async (
  lobbyRef: DatabaseReference,
  userId: string,
  userData: MarathonPlayerData,
  guess: string,
) => {
  const userPath = child(lobbyRef, `/players/${userId}`);

  await update(userPath, mutateIncorrectGuessData(userData, guess));
};
