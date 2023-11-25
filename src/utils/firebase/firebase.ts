import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, remove } from "firebase/database";
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

initializeApp(firebaseConfig);
export const db = getDatabase();

export const createNewFirebaseLobby = async (
  gameType: string,
  lobbyId: string,
  lobbyData?: {
    gameStarted: boolean;
    initilizedTimeStamp: Date;
    gameStartTimer?: number;
    round?: number;
    word?: string;
  },
) => {
  await set(ref(db, `${gameType}/${lobbyId}`), {
    lobbyData,
  });
  return lobbyId;
};

export const joinFirebaseLobby = async (
  lobbyId: string,
  userId: string,
  gameType: string,
  guessCount: number | null,
  word?: string,
) => {
  await set(ref(db, `${gameType}/${lobbyId}/players/${userId}`), {
    word: word,
    guesses: [null],
    startTime: null,
    allGuesses: [null],
    guessCount: guessCount,
  });
};

export const joinEliminationLobby = async (gamePath: string) => {
  await set(ref(db, gamePath), {
    points: 0,
  });
};

export const updateGuessesAndAllGuesses = async (
  lobbyId: string,
  userId: string,
  guesses: string[],
  allGuesses: string[],
  gameType: string,
) => {
  return await update(ref(db, `${gameType}/${lobbyId}/players/${userId}`), {
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
  gameType: string,
) => {
  await update(ref(db, `${gameType}/${lobbyId}/players/${userId}`), {
    guesses: guesses,
    word: word,
    timer: timer,
    failed: false,
  });
};

export const updateWord = async (
  lobbyId: string,
  userId: string,
  word: string,
  gameType: string,
) => {
  await update(ref(db, `${gameType}/${lobbyId}/players/${userId}`), {
    word: word,
  });
};

export const updateTimerAndGuesses = async (
  lobbyId: string,
  userId: string,
  closestWord: string,
  timer: number,
  gameType: string,
) => {
  await update(ref(db, `${gameType}/${lobbyId}/players/${userId}`), {
    guesses: [closestWord],
    timer: timer,
    failed: true,
  });
};

export const handleStartTimer = async (
  lobbyId: string,
  userId: string,
  gameType: string,
) => {
  await update(ref(db, `${gameType}/${lobbyId}/players/${userId}`), {
    timer: new Date().getTime() + 180000,
  });
};

export const handleRemoveUserFromLobby = async (
  lobbyId: string,
  userId: string,
  gameType: string,
) => {
  await remove(ref(db, `${gameType}/${lobbyId}/players/${userId}`));
};

export const handleIdleUser = async (
  lobbyId: string,
  userId: string,
  gameType: string,
) => {
  await update(ref(db, `${gameType}/${lobbyId}/players/${userId}`), {
    inActive: true,
  });
};

export const startGame = async (lobbyId: string, gameType: string) => {
  await update(ref(db, `${gameType}/${lobbyId}/lobbyData`), {
    gameStarted: true,
    startTime: new Date().getTime(),
  });
};

export const endGame = async (lobbyId: string, gameType: string) => {
  await remove(ref(db, `${gameType}/${lobbyId}`));
};

export const updateGuessCountAndMatchingIndex = async (
  gamePath: string,
  guessCount: number,
  matchingIndex: number[],
) => {
  await update(ref(db, gamePath), {
    guessCount: guessCount,
    matchingIndex: matchingIndex,
  });
};

export const createNewRound = async (
  playerPointsTemplate: {
    [keyof: string]: { points: 0 };
  },
  lobbyDataTemplate: {
    gameStarted: boolean;
    round: number;
    word: string;
    nextRoundStartTime: number;
  },
  gamePath: string,
) => {
  await set(ref(db, `${gamePath}`), {
    playerPoints: playerPointsTemplate,
    lobbyData: lobbyDataTemplate,
  });
};

export const handleCorrectGuess = async (
  gamePath: string,
  word: string,
  points: number,
  userId: string,
  previousWord: string,
) => {
  await remove(ref(db, `${gamePath}/roundData`));
  await update(ref(db, `${gamePath}/lobbyData/`), {
    word: word,
    previousWord: previousWord,
  });
  await update(ref(db, `${gamePath}/playerPoints/${userId}`), {
    points: points,
  });
};

export const handleEliminationWinner = async (
  gamePath: string,
  userId: string,
) => {
  await set(ref(db, `${gamePath}`), {
    userId: userId,
  });
};

export const lobbyCleanUp = async (
  gameType: string,
  lobbyId: string,
  userId: string,
) => {
  if (gameType === "MARATHON") {
    await remove(ref(db, `MARATHON/${lobbyId}/players/${userId}`));
  } else if (gameType === "ELIMINATION") {
    await remove(ref(db, `ELIMINATION/${lobbyId}/playerPoints/${userId}`));
    await remove(ref(db, `ELIMINATION/${lobbyId}/roundData/${userId}`));
  }
};

export const deleteLobby = async (gameType: string, lobbyId: string) => {
  await remove(ref(db, `${gameType}/${lobbyId}`));
};
