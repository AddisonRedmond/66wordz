import SIX_LETTER_WORDS from "./six-letter-words";
import words from "./words";
import FOUR_LETTER_WORDS from "./four-letter-words";

export const checkSpelling = (word: string) => {
  if (word.length === 4) {
    if (FOUR_LETTER_WORDS.includes(word)) {
      return true;
    }
  } else if (word.length === 5) {
    if (words.includes(word)) {
      return true;
    }
  } else if (word.length === 6) {
    if (SIX_LETTER_WORDS.includes(word)) {
      return true;
    }
  }
  return false;
};
