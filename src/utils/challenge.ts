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

  const guessesLength = Array.isArray(guesses) ? guesses.length : 0;

  if (guess === word && guessesLength < 5) {
    await updateDoc(documentReference, {
      [`${userId}.endTimeStamp`]: new Date().toString(), // Append guess to the array
      [`${userId}.completed`]: true,
      [`${userId}.success`]: true,
      [`${userId}.guesses`]: arrayUnion(guess), // Append guess to the array
      [`${userId}.matches`]: { ...newMatches },
    });
  }

  if (guesses && guesses.length + 1 >= 5) {
    console.log("GUESS GREATER THAN 5");
    await updateDoc(documentReference, {
      [`${userId}.guesses`]: arrayUnion(guess), // Append guess to the array
      [`${userId}.matches`]: { ...newMatches },
      [`${userId}.completed`]: true,
      [`${userId}.success`]: false,
      [`${userId}.endTimeStamp`]: new Date().toString(), // Append guess to the array
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
