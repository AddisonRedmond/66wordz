import {
  DocumentData,
  DocumentReference,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { handleMatched, Matches } from "./game";

export const handleCorrectGuess = (
  documentReference: DocumentReference<DocumentData, DocumentData>,
) => {
  // add finish date and time
  // add completed field: true
  // add success field: true
};

export const handleIncorrectGuess = async (
  userId: string,
  documentReference: DocumentReference<DocumentData, DocumentData>,
  guess: string,
  previousMatches?: Matches,
  word?: string,
) => {
  const newMatches = handleMatched(guess, word ?? "", previousMatches);

  // Update the document with the new data
  await updateDoc(documentReference, {
    [`${userId}.guesses`]: arrayUnion(guess), // Append guess to the array
    [`${userId}.matches`]: { ...newMatches },
  });

  // Document updated successfully
};
