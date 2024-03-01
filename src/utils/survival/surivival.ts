import { ref, update, set, db } from "../firebase/firebase";
import { handleGetNewWord } from "../game";
import dictionary from "../dictionary";
import { AutoAttackOption } from "~/components/survival/survival";

export type WordObject = {
  word: string;
  type: "shield" | "health";
  value: number;
  attack: number;
  matches?: {
    full: string[];
    partial: string[];
    none: string[];
  };
};

export type WordLength =
  | "FOUR_LETTER_WORD"
  | "FIVE_LETTER_WORD"
  | "SIX_LETTER_WORD";

export const survivalRules: { [header: string]: string[] } = {
  "Health and Shield": [
    "Start typing 5 letter word to guess",
    "Matches, partial matches, and no matches will be indicated on the keyboard",
    "When you guess the word correctly, you will gain the values for that word",
    "If your health reaches 0, you are eliminated",
    "Each incorrect guess will reduce the values of the word",
  ],
  Attack: [
    "Select who you want to damage when you guess a word correctly",
    "You can choose, first, last, random, or a specific player to attack",
  ],
};

export type PlayerData = {
  [id: string]: {
    health: number;
    shield: number;
    eliminated: boolean;
    initials?: string;
    word: WordObject;
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
  autoAttack: AutoAttackOption,
  playerId: string,
): string => {
  // Filter out eliminated players
  const activePlayers = Object.fromEntries(
    Object.entries(players).filter(([, player]) => !player.eliminated),
  );

  // Sort the active players
  const sortedPlayers: PlayerData = Object.fromEntries(
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
      return randomPlayerId === playerId ? "" : randomPlayerId;

    default:
      return autoAttack;
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
      gameStartTime: new Date().getTime() + 30000,
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
      eliminated: false,
      initials: getInitials(fullName),
      word: {
        word: handleGetNewWord(5),
        type: getRandomType(1),
        value: 40,
        attack: 50,
      },
    },
  };

  await update(ref(db, `SURVIVAL/${lobbyId}/players`), newPlayer);
};

export const handleCorrectGuess = async (
  lobbyId: string,
  userId: string,
  currentStatus?: { health: number; shield: number },
  wordValues?: { type: "health" | "shield"; value: number; attack: number },
) => {
  const determineType = (currentStatus?: {
    health: number;
    shield: number;
  }) => {
    if (!currentStatus) {
      return "shield";
    }

    if (currentStatus.health > currentStatus.shield) {
      return "shield";
    } else {
      return "health";
    }
  };
  const createUpdatedWordValues = () => {
    return {
      word: handleGetNewWord(5),
      type: determineType(currentStatus),
      value: 40,
      attack: 50,
    };
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
    await update(ref(db, `SURVIVAL/${lobbyId}/players/${userId}`), {
      [wordValues.type]: maxValueCheck(
        currentStatus?.[wordValues.type],
        wordValues.value,
      ),
    });

    await set(ref(db, `SURVIVAL/${lobbyId}/players/${userId}/word`), {
      ...createUpdatedWordValues(),
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
    eliminated: boolean;
  },
) => {
  const { health, shield } = playerStatus;

  if (!playerStatus.eliminated) {
    const updatedStatus =  calcualteUpdatedStatus(attackValue, shield, health);
    await update(ref(db, `SURVIVAL/${lobbyId}/players/${playerId}`), {
      ...updatedStatus,
    });
    return updatedStatus.eliminated;
  }
  return false;
};

export const handleMatched = (
  guess: string,
  word: string,
  previousMatches?: {
    full?: string[];
    partial?: string[];
    none?: string[];
  },
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

export const handleIncorrectGuess = (
  guess: string,
  lobbyId: string,
  userId: string,
  word: WordObject,
) => {
  // check each word for full, partial, and no matches
  const matches = handleMatched(guess, word.word, word.matches);
  const updatedWordData = {
    ...word,
    matches: matches,
    attack: word.attack <= 20 ? word.attack : word.attack - 5,
    value: word.value <= 20 ? word.value : word.value - 5,
  };

  update(
    ref(db, `SURVIVAL/${lobbyId}/players/${userId}/word`),
    updatedWordData,
  );
};
