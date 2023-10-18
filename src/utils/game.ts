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
  console.log(dataObject);
  let gameObj = {
    guesses: dataObject?.guesses ? dataObject.guesses : [],
    word: dataObject?.word ? dataObject.word : "ERROR",
    startTime: dataObject?.startTime,
    allGuesses: dataObject?.allGuesses ? dataObject.allGuesses : [],
  };
  return gameObj;
};
