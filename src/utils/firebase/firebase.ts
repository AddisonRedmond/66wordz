import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update } from "firebase/database";
import { env } from "~/env.mjs";

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

const app = initializeApp(firebaseConfig);
export const db = getDatabase();

export const createNewFirebaseLobby = (lobbyId: string) => {
  const timeStamp = new Date();
  set(ref(db, "publicLobbies/" + lobbyId), {
    initializeTimeStamp: `${timeStamp}`,
  });
};

export const joinFirebaseLobby = (
  lobbyId: string,
  userId: string,
  word: string,
) => {
  set(ref(db, "publicLobbies/" + lobbyId), {
    [userId]: {
      word: word,
      guesses: [null],
      startTime: null,
      allGuesses: [null],
    },
  });
};

export const updateGuessAndGuesses = async (
  lobbyId: string,
  userId: string,
  guesses: string[],
  allGuesses: string[],
) => {
  await update(ref(db, `publicLobbies/${lobbyId}/${userId}`), {
    guesses: guesses,
    allGuesses: allGuesses,
  });
};

export const updateWord = async (
  lobbyId: string,
  userId: string,
  word: string
) => {
 
    await update(ref(db, `publicLobbies/${lobbyId}/${userId}`), {
      word: word
    });

};
