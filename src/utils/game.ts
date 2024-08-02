import { ref, remove, set } from "firebase/database";
import words from "./words";
import { db } from "./firebase/firebase";

export type Matches = {
  full?: string[];
  partial?: string[];
  none?: string[];
};

export type CustomEliminationLobby = {
  gameStarted: boolean;
  round: number;
  roundTimer?: number;
  pointsGoal: number;
  winner?: string;
  finalRound: boolean;
  owner: string;
};
export type CustomSurvivalLobby = {
  gameStarted: boolean;
  owner: string;
};

export const handleGetNewWord = (): string => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex]!;
};

export const handleColor = (
  letter: string | undefined,
  word: string,
  index: number,
) => {
  if (letter) {
    if (!word?.split("").includes(letter)) {
      return "#545B77";
    } else if (letter === word?.split("")[index]) {
      return "#00DFA2";
    } else if (word?.split("").includes(letter)) {
      return "#F6FA70";
    }
  }
};

export const getInitials = (fullName?: string | null): string => {
  if (!fullName) {
    return "";
  }
  const names = fullName.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
  return initials;
};

export const handleMatched = (
  guess: string,
  word: string,
  previousMatches?: {
    full?: string[];
    partial?: string[];
    none?: string[];
  } | null,
): { full: string[]; partial: string[]; none: string[] } => {
  const full = new Set<string>([...(previousMatches?.full ?? [])]);
  const partial = new Set<string>([...(previousMatches?.partial ?? [])]);
  const none = new Set<string>([...(previousMatches?.none ?? [])]);

  guess.split("").forEach((letter: string, index: number) => {
    if (word[index] === letter) {
      full.add(letter);
    } else if (word.includes(letter)) {
      partial.add(letter);
    } else {
      none.add(letter);
    }
  });

  const matches = {
    full: Array.from(full),
    partial: Array.from(partial),
    none: Array.from(none),
  };

  return matches;
};

export const createCustomLobby = async (
  lobbyPath: string,
  lobbyData: CustomEliminationLobby | CustomSurvivalLobby,
) => {
  try {
    await set(ref(db, lobbyPath), { lobbyData: lobbyData });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const createCustomEliminationLobby = (owner: string) => {
  return {
    gameStarted: false,
    round: 1,
    finalRound: false,
    owner: owner,
  };
};

export const createCustomSurvivalLobby = (owner: string) => {
  return {
    gameStarted: false,
    owner: owner,
  };
};

export const deleteLobby = async (path: string) => {
  await remove(ref(db, path));
};

export function arraysContainSameElements(arr1: string[], arr2: string[]) {
  // Check if arrays have the same length
  if (arr1.length !== arr2.length) {
      return false;
  }


  // Sort both arrays
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  console.log(sortedArr1)
  console.log(sortedArr2)
  // Compare sorted arrays element by element
  for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
          return false;
      }
  }

  // If all elements match, arrays contain the same elements
  return true;
}


export const getRevealIndex = (
  word: string,
  guess: string,
  currentRevealedIndex?: number[],
): number[] => {
  const revealIndex = new Set([...(currentRevealedIndex ?? [])]);

  word.split("").forEach((letter, index) => {
    if (letter === guess.split("")[index]) {
      revealIndex.add(index);
    }
  });

  return Array.from(revealIndex);
};