export const handleKeyPress = (key: string, guess: string): string => {
  if (key === "Backspace") {
    if (guess.length) {
      return guess.slice(0, -1);
    }
  } else if (/[a-zA-Z]/.test(key) && key.length === 1 && guess.length < 5) {
    return `${guess}${key}`.toUpperCase();
  }

  return guess;
};

export const handleDeleteLetter = (guess: string, setGuess: () => void) => {
  if (guess.length) {
    console.log("HERE")
    console.log(guess)
    setGuess((prevGuess) => {
      return prevGuess.slice(0, -1);
    });
  }
};
