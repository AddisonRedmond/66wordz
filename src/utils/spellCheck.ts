import SIX_LETTER_WORDS from "./six-letter-words";
import words from "./words";
import FOUR_LETTER_WORDS from "./four-letter-words";
import dictionary from "./dictionary";

export const checkSpelling = (word: string) => {
  if (dictionary.includes(word)) {
    return true;
  } else {
    return false;
  }
};
