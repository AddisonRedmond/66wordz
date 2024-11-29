import { DatabaseReference, child, update } from "firebase/database";
import {
  DefaultLobbyData,
  DefaultPlayerData,
  getInitials,
  getRevealIndex,
  handleGetNewWord,
  handleMatched,
} from "./game";

export interface MarathonLobbyData extends DefaultLobbyData {
  round: number;
}

export interface MarathonPlayerData extends DefaultPlayerData {
  correctGuessCount: number;
  incorrectGuessCount: number;
}

export type MarathonGameData = {
  lobbyData: MarathonLobbyData;
  players: Record<string, MarathonPlayerData>;
  timers: Record<string, number>;
};

export const createNewMarathonLobby = () => {
  return {
    gameStarted: false,
    gameStartTime: new Date().getTime() + 30000,
    round: 1,
  };
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

const mutateCorrectGuessData = (userData: MarathonPlayerData) => {
  return {
    ...userData,
    correctGuessCount: userData.correctGuessCount + 1,
    // TODO: set a max time. Math.min(being 3 mins probably)
    incorrectGuessCount: 0,
    // TODO: remove and handle non null assertion
    matches: null,
    word: handleGetNewWord(),
    revealIndex: null,
  };
};

const mutateIncorrectGuessData = (
  userData: MarathonPlayerData,
  guess: string,
) => {
  return {
    ...userData,
    // TODO: set a max time. Math.min(being 3 mins or 180 seconds probably)
    incorrectGuessCount: userData.incorrectGuessCount + 1,
    matches: handleMatched(guess, userData.word, userData.matches),
    revealIndex: getRevealIndex(userData.word, guess, userData?.revealIndex),
  };
};

export const handleCorrectMarathonGuess = async (
  lobbyRef: DatabaseReference,
  userId: string,
  userData: MarathonPlayerData,
  userTimer: number,
  round: number,
) => {
  const userPath = child(lobbyRef, `/players/${userId}`);
  const timerPath = child(lobbyRef, `/timers/`);
  const lifeTime = lifeTimerIndex[round] ?? 15;

  void update(timerPath, { [userId]: userTimer + lifeTime });
  void update(userPath, mutateCorrectGuessData(userData));
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
