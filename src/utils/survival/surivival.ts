import {
  ref,
  update,
  set,
  db,
  handleIncorrectSurvialGuess,
} from "../firebase/firebase";
import { handleGetNewWord } from "../game";
import dictionary from "../dictionary";

export type WordObject = {
  [key: string]: {
    word: string;
    type: "shield" | "health";
    value: number;
    attack: number;
  };
};

export const survivalRules: { [header: string]: string[] } = {
  "Health and Shield": [
    "Guess 4, 5, or 6 letter word to reveal the hidden letters",
    "Each word has a differnt type, either health or shield and always has an attack value",
    "When you guess the word correctly, you will gain health or shield, and the attack value",
  ],
  Attack: [
    "If you have auto attack set, a player will be attacked right away",
    "If auto attack is off, you can attack a player at any time",
    "To attack you must have a attack value greater than 0",
    "click on the sword icon, then the player you want to attack",
  ],
  Tips: [
    "If your health reaches 0, you are eliminated",
    "Letters that are in the word but not in the correct position will be shown next to the word",
    "If you click on the partial matches, the keyboard will adjust to that word",
  ],
};

export type PlayerData = {
  [id: string]: {
    health: number;
    shield: number;
    attack: number;
    eliminated: boolean;
    initials?: string;
    words: {
      SIX_LETTER_WORD: {
        word: string;
        type: "shield" | "health";
        value: number;
        attack: number;
        matches: number[];
      };
      FIVE_LETTER_WORD: {
        word: string;
        type: "shield" | "health";
        value: number;
        attack: number;
        matches: number[];
      };
      FOUR_LETTER_WORD: {
        word: string;
        type: "shield" | "health";
        value: number;
        attack: number;
        matches: number[];
      };
    };
  };
};

export type wordTimer = {
  [id: string]: {
    SIX_LETTER_WORD_TIMER: NodeJS.Timeout;
    FIVE_LETTER_WORD_TIMER: NodeJS.Timeout;
    FOUR_LETTER_WORD_TIMER: NodeJS.Timeout;
  };
};

export const getPlayerPosition = (
  players: PlayerData,
  autoAttack: "first" | "last" | "random" | "off",
  playerId: string,
): string => {
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
        return Object.keys(sortedPlayers)[1] as string;
      } else {
        return Object.keys(sortedPlayers)[0] as string;
      }
    case "last":
      const keys = Object.keys(sortedPlayers);
      if (playerId === keys[keys.length - 1]) {
        return keys[keys.length - 2] as string;
      } else {
        return keys[keys.length - 1] as string;
      }
    case "random":
      const randomIndex = Math.floor(
        Math.random() * Object.keys(activePlayers).length,
      );
      const randomPlayerId = Object.keys(activePlayers)[randomIndex] as string;
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

  return "shield";
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
  });
};

export const joinSurivivalLobby = async (
  lobbyId: string,
  userId: string,
  fullName: string,
) => {
  const newPlayer: PlayerData = {
    [userId]: {
      health: 100,
      shield: 50,
      attack: 0,
      eliminated: false,
      initials: getInitials(fullName),
      words: {
        SIX_LETTER_WORD: {
          word: handleGetNewWord(6),
          type: getRandomType(1),
          value: roundToNearestFiveOrZero(getRandomNumber(35, 45)),
          attack: roundToNearestFiveOrZero(getRandomNumber(50, 75)),
          matches: [],
        },
        FIVE_LETTER_WORD: {
          word: handleGetNewWord(5),
          type: getRandomType(1),
          value: roundToNearestFiveOrZero(getRandomNumber(25, 35)),
          attack: roundToNearestFiveOrZero(getRandomNumber(30, 50)),
          matches: [],
        },
        FOUR_LETTER_WORD: {
          word: handleGetNewWord(4),
          type: getRandomType(1),
          value: roundToNearestFiveOrZero(getRandomNumber(10, 25)),
          attack: roundToNearestFiveOrZero(getRandomNumber(20, 30)),
          matches: [],
        },
      },
    },
  };

  await update(ref(db, `SURVIVAL/${lobbyId}/players`), newPlayer);
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
          type: getRandomType(getRandomNumber(1, 4)),
          value: roundToNearestFiveOrZero(getRandomNumber(20, 30)),
          attack: roundToNearestFiveOrZero(getRandomNumber(10, 25)),
        };
      case 5:
        return {
          word: handleGetNewWord(5),
          type: getRandomType(getRandomNumber(1, 4)),
          value: roundToNearestFiveOrZero(getRandomNumber(25, 35)),
          attack: roundToNearestFiveOrZero(getRandomNumber(30, 50)),
        };
      case 6:
        return {
          word: handleGetNewWord(6),
          type: getRandomType(getRandomNumber(1, 4)),
          value: roundToNearestFiveOrZero(getRandomNumber(35, 45)),
          attack: roundToNearestFiveOrZero(getRandomNumber(50, 75)),
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
    if (autoAttack === "off") {
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

    await set(
      ref(db, `SURVIVAL/${lobbyId}/players/${userId}/words/${wordLength}`),
      {
        ...createUpdatedWordValues(guess),
      },
    );
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
      currentMatchingIndexes[`${key}`] ?? [],
    );

    if (matchingIndexes.length === 0) {
      return;
    }

    // update the mathcing index individually
    handleIncorrectSurvialGuess(
      `SURVIVAL/${lobbyId}/players/${userId}/words/${key}`,
      matchingIndexes,
    );
  });

  // update all three words with the revealed indexes
};

export const extractMathingIndexes = (matchingIndexes: {
  [wordLength: string]: number[];
}) => {
  const indexObjext: { [key: string]: number[] } = {};
};
