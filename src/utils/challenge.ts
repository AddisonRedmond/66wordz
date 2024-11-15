import {
  DocumentData,
  DocumentReference,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { handleMatched, Matches } from "./game";

export const handleGuess = async (
  userId: string,
  documentReference: DocumentReference<DocumentData, DocumentData>,
  guess: string,
  previousMatches?: Matches,
  word?: string,
  guesses?: string[],
) => {
  const newMatches = handleMatched(guess, word ?? "", previousMatches);

  const guessesLength = guesses ? guesses.length : 0;
  if (guessesLength < 5) {
    try {
      await updateDoc(documentReference, {
        [`${userId}.guesses`]: arrayUnion(guess),
        [`${userId}.matches`]: { ...newMatches },
      });
    } catch (e) {
      console.error(e);
      // TODO: create an error logger
      return;
    }
  }

  // Document updated successfully
};
