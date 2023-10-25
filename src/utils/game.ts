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

export const formatGameData = (dataObject: {
  guesses?: string[];
  word?: string;
  timer: number;
  allGuesses?: string[];
}) => {
  let gameObj = {
    guesses: dataObject?.guesses ? dataObject.guesses : [],
    word: dataObject?.word ? dataObject.word : "ERROR",
    timer: dataObject.timer,
    allGuesses: dataObject?.allGuesses ? dataObject.allGuesses : [],
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

  let closestWord: string = "";
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
    return words[randomIndex] as string;
  }
  return "ERROR";
};

export const handleCorrectGuess = (
  lobbyId: string,
  userId: string,
  timer: number,
  numberOfGuesses: number,
) => {
  let updatedTimer: number = timeAdjustmentValues?.[numberOfGuesses] ?? 20000;

  if (new Date().getTime() + 180000 < timer + updatedTimer) {
    console.log("Greater than 3 mins");
    updatedTimer = new Date().getTime() + 180000;
  } else {
    console.log("Not greater than 3");
    updatedTimer = timer + updatedTimer;
  }

  updateGuessesAndWord(lobbyId, userId, [], handleGetNewWord(), updatedTimer);
  // clear out guesses from firebase
  // swap out the word in firebase
  // add time to timer
};

export const handleWordFailure = (
  guesses: string[],
  word: string,
  lobbyId: string,
  userId: string,
  timer: number,
) => {
  const closestWord = getClosestWord(word, guesses);
  updateTimerAndGuesses(lobbyId, userId, closestWord, timer);
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


const handleEndGame = (lobbyId: string, userId: string) => {
  // calculate if last person in lobby;
  // show total time user played, what place they got
  // all of their guesses
  // all of their correct guesses
  // show their place

  // quit match button, 
  // specate button,
}