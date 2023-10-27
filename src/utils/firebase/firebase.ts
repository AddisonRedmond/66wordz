import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, remove } from "firebase/database";
import { env } from "~/env.mjs";
import { handleGetNewWord } from "../game";

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_API_KEY,
  authDomain: env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_APP_ID,
  measurementId: env.NEXT_PUBLIC_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);
export const db = getDatabase();

export const createNewFirebaseLobby = async (lobbyId: string): Promise<void> => {
  const timeStamp = new Date();
  await set(ref(db, "publicLobbies/" + lobbyId), {
    initializeTimeStamp: `${timeStamp}`,
    gameStarted: false,
  });
};

export const joinFirebaseLobby = async (lobbyId: string, userId: string) => {
  await set(ref(db, `publicLobbies/${lobbyId}/players/${userId}`), {
    word: handleGetNewWord(),
    guesses: [null],
    startTime: null,
    allGuesses: [null],
  });
};

export const updateGuessesAndAllGuesses = async (
  lobbyId: string,
  userId: string,
  guesses: string[],
  allGuesses: string[],
) => {
  return await update(ref(db, `publicLobbies/${lobbyId}/players/${userId}`), {
    guesses: guesses,
    allGuesses: allGuesses,
  });
};

export const updateGuessesAndWord = async (
  lobbyId: string,
  userId: string,
  guesses: string[],
  word: string,
  timer: number,
) => {
  await update(ref(db, `publicLobbies/${lobbyId}/players/${userId}`), {
    guesses: guesses,
    word: word,
    timer: timer,
  });
};

export const updateWord = async (
  lobbyId: string,
  userId: string,
  word: string,
) => {
  await update(ref(db, `publicLobbies/${lobbyId}/players/${userId}`), {
    word: word,
  });
};

export const updateTimerAndGuesses = async (
  lobbyId: string,
  userId: string,
  closestWord: string,
  timer: number,
) => {
  await update(ref(db, `publicLobbies/${lobbyId}/players/${userId}`), {
    guesses: [closestWord],
    timer: timer - 20000,
  });
};

export const handleStartTimer = async (lobbyId: string, userId: string) => {
  await update(ref(db, `publicLobbies/${lobbyId}/players/${userId}`), {
    timer: new Date().getTime() + 180000,
  });
};

export const handleRemoveUserFromLobby = async (
  lobbyId: string,
  userId: string,
) => {
  await remove(ref(db, `publicLobbies/${lobbyId}/players/${userId}`));
};

export const handleIdleUser = async (lobbyId: string, userId: string) => {
  await update(ref(db, `publicLobbies/${lobbyId}/players/${userId}`), {
    inActive: true,
  });
};

export const startGame = async (lobbyId: string) => {
  await update(ref(db, `publicLobbies/${lobbyId}`), {
    gameStarted: true,
    startTime: new Date().getTime(),
  });
};
