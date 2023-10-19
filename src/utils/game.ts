import { updateGuessesAndWord, updateTimerAndGuesses } from "./firebase/firebase";
import words from "./words";
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
  startTime?: string;
  allGuesses?: string[];
}): {
  guesses: string[];
  word: string;
  startTime?: string;
  allGuesses: string[];
} => {
  let gameObj = {
    guesses: dataObject?.guesses ? dataObject.guesses : [],
    word: dataObject?.word ? dataObject.word : "ERROR",
    startTime: dataObject?.startTime,
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

export const handleCorrectGuess = (lobbyId: string, userId: string) => {
  updateGuessesAndWord(lobbyId, userId, [], handleGetNewWord());
  // clear out guesses from firebase
  // swap out the word in firebase
  // add time to timer
};

export const handleWordFailure = (
  guesses: string[],
  word: string,
  lobbyId: string,
  userId: string,
) => {
  const closestWord = getClosestWord(word, guesses)
  updateTimerAndGuesses(lobbyId, userId, closestWord)
};
