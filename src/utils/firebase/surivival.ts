import { ref, update, set } from "firebase/database";
import { db } from "./firebase";
import { handleGetNewWord } from "../game";

function getRandomNumber(min: number, max: number): number {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

function roundToNearestFiveOrZero(num: number): number {
  const remainder = num % 5;
  if (remainder <= 2.5) {
    return num - remainder;
  } else {
    return num + (5 - remainder);
  }
}

const getRandomType = (number: number) => {
  if (number % 2 === 0) {
    return "health";
  } else if (number % 2 !== 0) {
    return "shield";
  }
};

export const createNewSurivivalLobby = async (lobbyId: string) => {
  await set(ref(db, `SURVIVAL/${lobbyId}`), {
    lobbyData: {
      gameStarted: false,
      gameStartTime: new Date().getTime() + 60000,
      damangeValue: 0,
    },
    words: {
      word1: {
        word: handleGetNewWord(6),
        type: getRandomType(1),
        value: roundToNearestFiveOrZero(getRandomNumber(50, 75)),
      },
      word2: {
        word: handleGetNewWord(5),
        type: getRandomType(1),
        value: roundToNearestFiveOrZero(getRandomNumber(30, 50)),
      },
      word3: {
        word: handleGetNewWord(5),
        type: getRandomType(1),
        value: roundToNearestFiveOrZero(getRandomNumber(20, 30)),
      },
    },
  });
};

export const joinSurivivalLobby = async (lobbyId: string, userId: string) => {
  await update(ref(db, `SURVIVAL/${lobbyId}/players/${userId}`), {
    health: 100,
    shield: 50,
  });
};

export const handleCorrectGuess = async (
  lobbyId: string,
  userId: string,
  type: "health" | "shield",
  value: number,
  currentStatus: number,
) => {
  if (currentStatus >= 100) {
    return;
  } else {
    await update(ref(db, `SURVIVAL/${lobbyId}/players/${userId}`), {
      [type]: value,
    });
    await update(ref(db, `SURVIVAL/${lobbyId}/lobbyData`), {});
  }
};
