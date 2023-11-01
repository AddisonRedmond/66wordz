export const handleCorrectAnswer = () => {};

export const handleCreateWordIndex = (
  guess: string,
  word: string,
  matchingIndex: number[],
) => {
  const guessArray = guess.split("");
  const wordArray = word.split("");
    console.log("UPDATING!")
  guessArray.forEach((letter: string, index: number) => {
    if (letter === wordArray[index]) {
       matchingIndex.push(index)
    }
  });

  return matchingIndex;
};
