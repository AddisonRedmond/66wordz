import { db } from "../firebase/firebase";
import { ref, set, update } from "firebase/database";
import { getInitials, handleGetNewWord, handleMatched } from "../game";
import dictionary from "../dictionary";
import { AutoAttackOption } from "~/components/survival/survival";

const ATTACK_VALUE = 50;
const TYPE_VALUE = 50;

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

export type SurvivalPlayerDataObject = {
  health: number;
  shield: number;
  eliminated: boolean;
  initials: string;
  word: WordObject;
};

export type SurvivalPlayerData = {
  [id: string]: {
    health: number;
    shield: number;
    eliminated: boolean;
    initials?: string;
    word: WordObject;
  };
};

export const getPlayerPosition = (
  players: SurvivalPlayerData,
  autoAttack: AutoAttackOption,
  playerId: string,
): string => {
  // Filter out eliminated players
  const activePlayers = Object.fromEntries(
    Object.entries(players).filter(([, player]) => !player.eliminated),
  );

  // Sort the active players
  const sortedPlayers: SurvivalPlayerData = Object.fromEntries(
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

const calcualteUpdatedStatus = (playerStatus: {
  health: number;
  shield: number;
  eliminated: boolean;
}) => {
  if (playerStatus.health == 0) {
    return {
      shield: playerStatus.health,
      health: playerStatus.health - 1,
      eliminated: false,
    };
  }
};

export const createNewSurivivalLobby = () => {
  return {
    lobbyData: {
      gameStarted: false,
      gameStartTime: new Date().getTime() + 30000,
      damangeValue: 0,
    },
  };
};

export const joinSurivivalLobby = (
  userId: string,
  fullName?: string | null,
) => {
  const newPlayer: SurvivalPlayerData = {
    [userId]: {
      health: 100,
      shield: 50,
      eliminated: false,
      initials: getInitials(fullName) || "N/A",
      word: {
        word: handleGetNewWord(),
        type: "shield",
        value: TYPE_VALUE,
        attack: ATTACK_VALUE,
      },
    },
  };

  return newPlayer;
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
    const wordType = determineType(currentStatus);
    const newWord = handleGetNewWord();

    if (currentStatus?.health == 100 && currentStatus?.shield == 100) {
      return {
        word: newWord,
        type: "shield",
        value: 0,
        attack: 100,
      };
    } else if (wordType === "health") {
      return {
        word: handleGetNewWord(),
        type: "health",
        value: 20,
        attack: 60,
      };
    } else {
      return {
        word: handleGetNewWord(),
        type: "shield",
        value: 60,
        attack: 20,
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
};

export const checkSpelling = (word: string) => {
  return dictionary.includes(word.toLocaleUpperCase());
};

export const handleAttack = async (
  lobbyId: string,
  playerId: string,
  playerStatus: {
    health: number;
    shield: number;
    eliminated: boolean;
  },
) => {
  if (!playerStatus.eliminated) {
    const updatedStatus = calcualteUpdatedStatus(playerStatus);
    await update(ref(db, `SURVIVAL/${lobbyId}/players/${playerId}`), {
      ...updatedStatus,
    });
    return updatedStatus.eliminated;
  }
  return false;
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
