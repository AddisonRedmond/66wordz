import {
  ref,
  update,
  set,
  db,
  handleIncorrectSurvialGuess,
  remove,
} from "./firebase/firebase";
import { handleGetNewWord } from "./game";
import dictionary from "../utils/dictionary";

export type WordObject = {
  [key: string]: {
    word: string;
    type: "shield" | "health";
    value: number;
    attack: number;
  };
};

export const getPlayerPosition = (
  players: {
    [id: string]: {
      health: number;
      shield: number;
      attack: number;
      eliminated: boolean;
      initials?: string;
    };
  },
  autoAttack: "first" | "last" | "random" | "off",
  playerId: string,
) => {
  // Filter out eliminated players
  const activePlayers = Object.fromEntries(
    Object.entries(players).filter(([id, player]) => !player.eliminated),
  );

  // Sort the active players
  const sortedPlayers: {} = Object.fromEntries(
    Object.entries(activePlayers).sort(
      (a, b) => b[1].health + b[1].shield - (a[1].health + a[1].shield),
    ),
  );

  switch (autoAttack) {
    case "first":
      if (playerId === Object.keys(sortedPlayers)[0]) {
        return Object.keys(sortedPlayers)[1];
      } else {
        return Object.keys(sortedPlayers)[0];
      }
    case "last":
      const keys = Object.keys(sortedPlayers);
      if (playerId === keys[keys.length - 1]) {
        return keys[keys.length - 2];
      } else {
        return keys[keys.length - 1];
      }
    case "random":
      const randomIndex = Math.floor(
        Math.random() * Object.keys(activePlayers).length,
      );
      const randomPlayerId = Object.keys(activePlayers)[randomIndex];
      return randomPlayerId !== playerId ? randomPlayerId : "";

    default:
      return "";
  }
};

export function getRandomNumber(min: number, max: number): number {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

const getInitials = (fullName: string): string => {
  const names = fullName.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
  return initials;
};

function roundToNearestFiveOrZero(num: number): number {
  const remainder = num % 5;
  if (remainder <= 2.5) {
    return num - remainder;
  } else {
    return num + (5 - remainder);
  }
}

const getRandomType = (number: number) => {
  if (number % 2 === 0) {
    return "health";
  } else if (number % 2 !== 0) {
    return "shield";
  }
};

const calcualteUpdatedStatus = (
  attackValue: number,
  shield: number,
  health: number,
) => {
  const updatedStatus: {
    health: number;
    shield: number;
    eliminated: boolean;
  } = {
    health: health,
    shield: shield,
    eliminated: false,
  };
  if (shield - attackValue < 0) {
    updatedStatus.shield = 0;
    updatedStatus.health =
      health - (attackValue - shield) < 0 ? 0 : health - (attackValue - shield);
  } else if (shield - attackValue >= 0) {
    updatedStatus.shield = shield - attackValue;
    updatedStatus.health = health;
  }

  if (updatedStatus.health <= 0) {
    updatedStatus.eliminated = true;
  }

  return updatedStatus;
};

export const createNewSurivivalLobby = async (lobbyId: string) => {
  await set(ref(db, `SURVIVAL/${lobbyId}`), {
    lobbyData: {
      gameStarted: false,
      gameStartTime: new Date().getTime() + 60000,
      damangeValue: 0,
    },
    words: {
      SIX_LETTER_WORD: {
        word: handleGetNewWord(6),
        type: getRandomType(1),
        value: roundToNearestFiveOrZero(getRandomNumber(50, 75)),
        attack: roundToNearestFiveOrZero(getRandomNumber(35, 45)),
      },
      FIVE_LETTER_WORD: {
        word: handleGetNewWord(5),
        type: getRandomType(1),
        value: roundToNearestFiveOrZero(getRandomNumber(30, 50)),
        attack: roundToNearestFiveOrZero(getRandomNumber(25, 35)),
      },
      FOUR_LETTER_WORD: {
        word: handleGetNewWord(4),
        type: getRandomType(1),
        value: roundToNearestFiveOrZero(getRandomNumber(20, 30)),
        attack: roundToNearestFiveOrZero(getRandomNumber(10, 25)),
      },
    },
  });
};

export const joinSurivivalLobby = async (
  lobbyId: string,
  userId: string,
  fullName: string,
) => {
  await update(ref(db, `SURVIVAL/${lobbyId}/players/${userId}`), {
    health: 100,
    shield: 50,
    attack: 0,
    eliminated: false,
    initials: getInitials(fullName),
  });
};

export const handleCorrectGuess = async (
  lobbyId: string,
  userId: string,
  wordLength: "FOUR_LETTER_WORD" | "FIVE_LETTER_WORD" | "SIX_LETTER_WORD",
  guess: string,
  autoAttack: "first" | "last" | "random" | "off",
  currentStatus?: { health: number; shield: number; attack: number },
  wordValues?: { type: "health" | "shield"; value: number; attack: number },
) => {
  const createUpdatedWordValues = (word: string) => {
    switch (word.length) {
      case 4:
        return {
          word: handleGetNewWord(4),
          type: getRandomType(4),
          value: roundToNearestFiveOrZero(getRandomNumber(20, 30)),
          attack: roundToNearestFiveOrZero(getRandomNumber(10, 25)),
          revealedIndex: null,
        };
      case 5:
        return {
          word: handleGetNewWord(5),
          type: getRandomType(4),
          value: roundToNearestFiveOrZero(getRandomNumber(30, 50)),
          attack: roundToNearestFiveOrZero(getRandomNumber(25, 35)),
          revealedIndex: null,
        };
      case 6:
        return {
          word: handleGetNewWord(6),
          type: getRandomType(4),
          value: roundToNearestFiveOrZero(getRandomNumber(50, 75)),
          attack: roundToNearestFiveOrZero(getRandomNumber(35, 45)),
          revealedIndex: null,
        };
    }
  };
  // check to make sure attack + current attack is not greater than 100
  const maxValueCheck = (value1?: number, value2?: number) => {
    if (value1 !== undefined && value2 !== undefined) {
      if (value1 + value2 >= 100) {
        return 100;
      } else {
        return value1 + value2;
      }
    } else {
      return 0;
    }
  };
  if (wordValues) {
    if (autoAttack !== "off") {
      await update(ref(db, `SURVIVAL/${lobbyId}/players/${userId}`), {
        attack: maxValueCheck(currentStatus?.attack, wordValues?.attack),
        [wordValues.type]: maxValueCheck(
          currentStatus?.[wordValues.type],
          wordValues.value,
        ),
      });
    } else {
      await update(ref(db, `SURVIVAL/${lobbyId}/players/${userId}`), {
        [wordValues.type]: maxValueCheck(
          currentStatus?.[wordValues.type],
          wordValues.value,
        ),
      });
    }

    // change this static value to a function to update the word values

    await remove(ref(db, `SURVIVAL/${lobbyId}/${wordLength}_MATCHES`));
    await set(ref(db, `SURVIVAL/${lobbyId}/words/${wordLength}`), {
      ...createUpdatedWordValues(guess),
    });
  }

  // update word with new values
};

export const checkSpelling = (word: string) => {
  return dictionary.includes(word.toLocaleUpperCase());
};

export const wordLength = (word: string) => {
  switch (word.length) {
    case 4:
      return "FOUR_LETTER_WORD";
    case 5:
      return "FIVE_LETTER_WORD";
    case 6:
      return "SIX_LETTER_WORD";
    default:
      return "SIX_LETTER_WORD";
  }
};

export const handleAttack = async (
  lobbyId: string,
  playerId: string,
  attackValue: number,
  playerStatus: {
    health: number;
    shield: number;
    attack: number;
    eliminated: boolean;
  },
  attackerId: string,
) => {
  const { health, shield } = playerStatus;

  if (!playerStatus.eliminated) {
    await set(ref(db, `SURVIVAL/${lobbyId}/players/${attackerId}/attack`), 0);
    await update(ref(db, `SURVIVAL/${lobbyId}/players/${playerId}`), {
      ...calcualteUpdatedStatus(attackValue, shield, health),
    });
  }
};

const handleAutoAttack = async (
  attack: number,
  lobbyId: string,
  playerToAttackId: string,
  playerToAttackStatus: {
    health: number;
    shield: number;
    attack: number;
    eliminated: boolean;
  },
) => {
  const { health, shield } = playerToAttackStatus;
  const calcualteUpdatedStatus = (
    attackValue: number,
    shield: number,
    health: number,
  ) => {
    const updatedStatus: {
      health: number;
      shield: number;
      eliminated: boolean;
    } = {
      health: health,
      shield: shield,
      eliminated: false,
    };
    if (shield - attackValue < 0) {
      updatedStatus.shield = 0;
      updatedStatus.health =
        health - (attackValue - shield) < 0
          ? 0
          : health - (attackValue - shield);
    } else if (shield - attackValue >= 0) {
      updatedStatus.shield = shield - attackValue;
      updatedStatus.health = health;
    }

    if (updatedStatus.health <= 0) {
      updatedStatus.eliminated = true;
    }

    return updatedStatus;
  };

  await update(ref(db, `SURVIVAL/${lobbyId}/players/${playerToAttackId}`), {
    ...calcualteUpdatedStatus(attack, shield, health),
  });
};

const findMatchingIndexes = (
  word: string,
  guess: string,
  previousArray: number[],
): number[] => {
  let matchingIndex: number[] = [];

  word.split("").forEach((letter: string, index: number) => {
    if (letter === guess[index]) {
      matchingIndex.push(index);
    }
  });

  const uniqueIndexes: Set<number> = new Set([
    ...previousArray,
    ...matchingIndex,
  ]);

  return Array.from(uniqueIndexes);
};

export const handleIncorrectGuess = async (
  guess: string,
  lobbyId: string,
  userId: string,
  words: WordObject,
  currentMatchingIndexes: { [wordLength: string]: number[] | undefined },
) => {
  // check each word for matching indexes

  Object.keys(words).forEach((key: string) => {
    const matchingIndexes = findMatchingIndexes(
      words[key]!.word,
      guess,
      currentMatchingIndexes[`${key}_MATCHES`] ?? [],
    );

    if (matchingIndexes.length === 0) {
      return;
    }

    handleIncorrectSurvialGuess(
      `SURVIVAL/${lobbyId}/${key}_MATCHES`,
      matchingIndexes,
      userId,
    );
  });

  // update all three words with the revealed indexes
};

export const extractMathingIndexes = (matchingIndexes: {
  [wordLength: string]: number[];
}) => {
  const indexObjext: { [key: string]: number[] } = {};
};
