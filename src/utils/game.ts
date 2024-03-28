import {
  updateGuessesAndWord,
  updateTimerAndGuesses,
} from "./firebase/firebase";
import words from "./words";
import SIX_LETTER_WORDS from "./six-letter-words";
import FOUR_LETTER_WORDS from "./four-letter-words";
import { GameType } from "@prisma/client";

const timeAdjustmentValues: { [key: number]: number } = {
  0: 180000,
  1: 180000,
  2: 30000,
  3: 30000,
  4: 20000,
  5: 20000,
  6: 10000,
};

export const formatGameData = (
  dataObject:
    | {
        guesses?: string[];
        word?: string;
        timer?: number;
        allGuesses?: string[];
        failed: boolean;
      }
    | undefined,
) => {
  const gameObj = {
    guesses: dataObject?.guesses ? dataObject.guesses : [],
    word: dataObject?.word ? dataObject.word : "ERROR",
    timer: dataObject?.timer ? dataObject.timer : 0,
    allGuesses: dataObject?.allGuesses ? dataObject.allGuesses : [],
    failed: dataObject?.failed ? dataObject.failed : false,
  };
  return gameObj;
};

export const getClosestWord = (word: string, guesses: string[]) => {
  const countMatchingLetter = (word1: string, word2: string) => {
    let count = 0;

    const minLength = Math.min(word1.length, word2.length);

    for (let i = 0; i < minLength; i++) {
      if (word1[i] === word2[i]) {
        count++;
      }
    }

    return count;
  };

  let closestWord = "";
  let closestMatchCount = -1;

  for (const guess of guesses) {
    const currentWord = guess;
    const matchCount = countMatchingLetter(word, currentWord);

    if (matchCount > closestMatchCount) {
      closestMatchCount = matchCount;
      closestWord = currentWord;
    }
  }

  return closestWord;
};

export const handleGetNewWord = (wordLength?: number): string => {
  let randomIndex;

  switch (wordLength) {
    case 4:
      randomIndex = Math.floor(Math.random() * FOUR_LETTER_WORDS.length);
      return FOUR_LETTER_WORDS[randomIndex]!;
    case 6:
      randomIndex = Math.floor(Math.random() * SIX_LETTER_WORDS.length);
      return SIX_LETTER_WORDS[randomIndex]!;
    case 5:
      randomIndex = Math.floor(Math.random() * words.length);
      return words[randomIndex]!;
    default:
      randomIndex = Math.floor(Math.random() * words.length);
      return words[randomIndex]!;
  }
};

export const handleCorrectGuess = async (
  lobbyId: string,
  userId: string,
  timer: number,
  numberOfGuesses: number,
  gameType: GameType,
  correctGuessCount: number,
): Promise<void> => {
  let updatedTimer: number = timeAdjustmentValues?.[numberOfGuesses] ?? 20000;

  if (new Date().getTime() + 180000 < timer + updatedTimer) {
    updatedTimer = new Date().getTime() + 180000;
  } else {
    updatedTimer = timer + updatedTimer;
  }

  await updateGuessesAndWord(
    lobbyId,
    userId,
    [],
    handleGetNewWord(),
    updatedTimer,
    gameType,
    correctGuessCount,
  );
  // clear out guesses from firebase
  // swap out the word in firebase
  // add time to timer
};

export const handleWordFailure = async (
  guesses: string[],
  word: string,
  lobbyId: string,
  userId: string,
  timer: number,
  gameType: GameType,
): Promise<void> => {
  const closestWord = getClosestWord(word, guesses);
  const updatedTimer = timer - 20000;
  await updateTimerAndGuesses(
    lobbyId,
    userId,
    closestWord,
    updatedTimer,
    gameType,
  );
};

export const handleColor = (
  letter: string | undefined,
  word: string,
  index: number,
) => {
  if (letter) {
    if (!word?.split("").includes(letter)) {
      return "#545B77";
    } else if (letter === word?.split("")[index]) {
      return "#00DFA2";
    } else if (word?.split("").includes(letter)) {
      return "#F6FA70";
    }
  }
};

export const calculateTimePlayed = (startTime: number, endTime: number) => {
  const totalSeconds = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes} mins ${seconds} secs`;
};

export const getInitials = (fullName?: string | null): string => {
  if (!fullName) {
    return "";
  }
  const names = fullName.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
  return initials;
};

export const handleMatched = (
  guess: string,
  word: string,
  previousMatches?: {
    full?: string[];
    partial?: string[];
    none?: string[];
  },
): { full: string[]; partial: string[]; none: string[] } => {
  const full = new Set<string>([...(previousMatches?.full ?? [])]);
  const partial = new Set<string>([...(previousMatches?.partial ?? [])]);
  const none = new Set<string>([...(previousMatches?.none ?? [])]);

  guess.split("").forEach((letter: string, index: number) => {
    if (word[index] === letter) {
      full.add(letter);
    } else if (word.includes(letter)) {
      partial.add(letter);
    } else {
      none.add(letter);
    }
  });

  const matches = {
    full: Array.from(full),
    partial: Array.from(partial),
    none: Array.from(none),
  };

  return matches;
};
