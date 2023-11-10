import { updatePoints } from "./firebase/firebase";

import dictionary from "./dictionary";

const pointTable: { [key: number]: number } = {
  0: 500,
  1: 500,
  2: 200,
  3: 150,
  4: 100,
  5: 90,
  6: 80,
  7: 70,
};

export const calculatePoints = (guessCount: number, points: number) => {
  const pointValue = pointTable[guessCount] ?? 0; // Use the nullish coalescing operator
  if (guessCount > 7) {
    return 60 + points;
  } else {
    return pointValue + points;
  }
};

export const handleCreateMatchingIndex = (
  guess: string,
  word: string,
  matchingIndex: number[],
): number[] => {
  const guessArray = guess.split("");
  const wordArray = word.split("");
  const newArr: number[] = [...matchingIndex];
  guessArray.forEach((letter: string, index: number) => {
    if (letter === wordArray[index]) {
      newArr.push(index);
    }
  });

  return newArr.filter(
    (item: number, index: number) => newArr.indexOf(item) === index,
  );
};

export const spellCheck = (guess: string) => {
  if (dictionary.includes(guess)) {
    return true;
  } else {
    return false;
  }
};

export const handleEliminationMatched = (
  guess: string,
  word: string,
  previousMatch: {
    fullMatch: string[];
    partialMatch: string[];
    noMatch: string[];
  },
): { fullMatch: string[]; partialMatch: string[]; noMatch: string[] } => {
  const fullMatch: string[] = [];
  const partialMatch: string[] = [];
  const noMatch: string[] = [];
  if (guess) {
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
  }

  return {
    fullMatch: [...previousMatch.fullMatch, ...fullMatch],
    partialMatch: [...previousMatch.partialMatch, ...partialMatch],
    noMatch: [...previousMatch.noMatch, ...noMatch],
  };
};

export const calculateSpots = (round: number, playerCount: number) => {
  const calculateNumber = () => {
    switch (round) {
      case 1:
        return playerCount / 1.4;
      case 2:
        return playerCount / 1.5;
      case 3:
        return playerCount / 1.8;
      case 4:
        return playerCount / 1.8;
      case 5:
        return playerCount / 2;
      case 6:
        return playerCount / 2;
      default:
        return playerCount / 2;
    }
  };

  return Math.floor(calculateNumber());
};
