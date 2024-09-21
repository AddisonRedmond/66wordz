import dictionary from "./dictionary";

export const checkSpelling = (word: string) => {
  if (dictionary.includes(word)) {
    return true;
  } else {
    return false;
  }
};
