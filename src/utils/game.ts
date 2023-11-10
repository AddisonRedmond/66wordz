import {
  updateGuessesAndWord,
  updateTimerAndGuesses,
} from "./firebase/firebase";
import words from "./words";

const timeAdjustmentValues: { [key: number]: number } = {
  0: 180000,
  1: 180000,
  2: 30000,
  3: 30000,
  4: 20000,
  5: 20000,
  6: 10000,
};

export const handleMatched = (
  guesses: string[],
  word: string,
): { fullMatch: string[]; partialMatch: string[]; noMatch: string[] } => {
  const fullMatch: string[] = [];
  const partialMatch: string[] = [];
  const noMatch: string[] = [];
  if (guesses.length) {
    guesses.forEach((guess: string) => {
      guess.split("").forEach((letter: string, index: number) => {
        const letterArray = word.split("");
        if (letterArray[index] === letter) {
          fullMatch.push(letter);
        } else if (letterArray.includes(letter)) {
          partialMatch.push(letter);
        } else {
          noMatch.push(letter);
        }
      });
    });
  }

  return {
    fullMatch: fullMatch,
    partialMatch: partialMatch,
    noMatch: noMatch,
  };
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

export const handleGetNewWord = (): string => {
  const randomIndex = Math.floor(Math.random() * words.length);
  if (randomIndex >= 0 && randomIndex < words.length) {
    return words[randomIndex]!;
  }
  return "ERROR";
};

export const handleCorrectGuess = async (
  lobbyId: string,
  userId: string,
  timer: number,
  numberOfGuesses: number,
  gameType: string,
): Promise<void> => {
  let updatedTimer: number = timeAdjustmentValues?.[numberOfGuesses] ?? 20000;
  if (failed) {
    updatedTimer = timer + 10000;
  } else if (new Date().getTime() + 180000 < timer + updatedTimer) {
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
  gameType: string,
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

export const canculateTimePlayed = (startTime: number, endTime: number) => {
  const totalSeconds = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes} mins ${seconds} secs`;
};
