import { db } from "../firebase/firebase";
import { ref, update } from "firebase/database";
import { getInitials, handleGetNewWord, handleMatched } from "../game";
import dictionary from "../dictionary";
import { AutoAttackOption } from "~/components/survival/survival";

const MAX_SHIELD = 4;

export type WordObject = {
  word: string;
  matches?: {
    full: string[];
    partial: string[];
    none: string[];
  };
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
  // remove shield
  // if shield isnt enough, then remove health
  // check if the health has been removed fully and mark player eliminated
  const { health, shield } = playerStatus;

  if (shield > 0) {
    return {
      ...playerStatus,
      shield: shield - 1,
    };
  } else if (shield <= 0 && health > 0) {
    if (health - 1 <= 0) {
      return {
        ...playerStatus,
        eliminated: true,
        health: health - 1,
      };
    }
    return {
      ...playerStatus,
      health: health - 1,
    };
  } else if (0 >= health) {
    return {
      ...playerStatus,
      eliminated: true,
      health: 0,
    };
  }

  return {
    ...playerStatus,
  };
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
      health: 2,
      shield: 2,
      eliminated: false,
      initials: getInitials(fullName) || "N/A",
      word: {
        word: handleGetNewWord(),
      },
    },
  };

  return newPlayer;
};

export const handleCorrectGuess = async (
  lobbyId: string,
  userId: string,
  playerStatus?: { health: number; shield: number; eliminated: boolean },
) => {
  if (playerStatus) {
    if (playerStatus.shield < MAX_SHIELD) {
      await update(ref(db, `SURVIVAL/${lobbyId}/players/${userId}`), {
        shield: playerStatus.shield + 1,
        word: {
          word: handleGetNewWord(),
          matches: {},
        },
      });
      return;
    }
  }
  await update(ref(db, `SURVIVAL/${lobbyId}/players/${userId}`), {
    word: {
      word: handleGetNewWord(),
      matches: {},
    },
  });
};

export const checkSpelling = (word: string) => {
  return dictionary.includes(word.toLocaleUpperCase());
};

export const healPlayer = async (
  lobbyId: string,
  playerId: string,
  healthValue?: number,
) => {
  if (healthValue && healthValue == 1) {
    await update(ref(db, `SURVIVAL/${lobbyId}/players/${playerId}`), {
      health: 2,
    });
  }
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
  if (!playerStatus?.eliminated) {
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

  update(
    ref(db, `SURVIVAL/${lobbyId}/players/${userId}/word/matches`),
    matches,
  );
};
