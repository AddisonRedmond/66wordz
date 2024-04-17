import {
  DocumentData,
  DocumentReference,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { handleMatched, Matches } from "./game";

export const handleCorrectGuess = async (
  userId: string,
  documentReference: DocumentReference<DocumentData, DocumentData>,
) => {
  // add finish date and time
  await updateDoc(documentReference, {
    [`${userId}.endTimeStamp`]: new Date(), // Append guess to the array
    [`${userId}.completed`]: true,
    [`${userId}.success`]: true,
  });

  // add completed field: true
  // add success field: true
};

export const handleGuess = async (
  userId: string,
  documentReference: DocumentReference<DocumentData, DocumentData>,
  guess: string,
  previousMatches?: Matches,
  word?: string,
  guesses?: string[],
) => {
  const newMatches = handleMatched(guess, word ?? "", previousMatches);

  if (guesses && guesses.length >= 5) {
    await updateDoc(documentReference, {
      [`${userId}.guesses`]: arrayUnion(guess), // Append guess to the array
      [`${userId}.matches`]: { ...newMatches },
      [`${userId}.completed`]: true,
      [`${userId}.success`]: false,
    });
  } else if (guess === word) {
    await updateDoc(documentReference, {
      [`${userId}.endTimeStamp`]: new Date(), // Append guess to the array
      [`${userId}.completed`]: true,
      [`${userId}.success`]: true,
      [`${userId}.guesses`]: arrayUnion(guess), // Append guess to the array
      [`${userId}.matches`]: { ...newMatches },
    });
  } else {
    // Update the document with the new data
    await updateDoc(documentReference, {
      [`${userId}.guesses`]: arrayUnion(guess), // Append guess to the array
      [`${userId}.matches`]: { ...newMatches },
    });
  }

  // Document updated successfully
};
