import { db } from "../firebase/firebase";
import { DatabaseReference, update } from "firebase/database";
import { getInitials, handleGetNewWord, handleMatched } from "../game";
import dictionary from "../dictionary";
import { AttackPosition } from "~/components/survival/survival";

const MAX_SHIELD = 4;
const MAX_HEALTH = 2;
const MIN_HEALTH = 1;

export type WordObject = {
  word: string;
  matches?: {
    full: string[];
    partial: string[];
    none: string[];
  };
};

export type SurvivalPlayerObject = {
  health: number;
  shield: number;
  eliminated: boolean;
  word: WordObject;
  initials?: string;
  revealIndex: number[];
};

export type SurvivalPlayerData = {
  [keyof: string]: {
    health: number;
    shield: number;
    eliminated: boolean;
    word: WordObject;
    initials?: string;
    revealIndex: number[];
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
      revealIndex: [],
      word: {
        word: handleGetNewWord(),
      },
    },
  };

  return newPlayer;
};

export const findPlayerToAttack = (
  playerId: string,
  players: SurvivalPlayerData,
  position: AttackPosition,
) => {
  // alphabetically sorted players who aren't eliminated
  const nonEliminatedPlayersOrdered: string[] = Object.keys(players)
    .filter((id) => !players[id]?.eliminated || id !== playerId)
    .toSorted(
      (a, b) =>
        players[b]!.health +
        players[b]!.shield -
        (players[a]!.health + players[a]!.shield),
    );

  const validateTarget = (id: string) => {
    if (!players[id]?.eliminated) {
      return id;
    } else {
      // return random id
      return nonEliminatedPlayersOrdered[
        Math.floor(Math.random() * nonEliminatedPlayersOrdered.length)
      ];
    }
  };

  // build updated player object,

  // updated firebase

  if (position === "first") {
    return nonEliminatedPlayersOrdered[0];
  } else if (position === "last") {
    return nonEliminatedPlayersOrdered[nonEliminatedPlayersOrdered.length - 1];
  } else {
    return validateTarget(position);
  }
};

export const handleCorrectGuess = async (
  lobbyRef: DatabaseReference,
  userId: string,
  userData: SurvivalPlayerObject,
  playerToAttackId: string,
  playerToAttackData: SurvivalPlayerObject,
): Promise<boolean> => {
  let playerEliminated = false;

  if (!playerToAttackId || !playerToAttackData) {
    // TODO: add notification that there is no player to attack, or add other logic
    return playerEliminated;
  }

  // Handle player elimination and health/shield adjustments
  if (
    playerToAttackData.shield <= 0 &&
    playerToAttackData.health <= MIN_HEALTH
  ) {
    playerToAttackData.eliminated = true;
    playerToAttackData.health = 0;
    playerEliminated = true;
  } else if (playerToAttackData.shield < MAX_SHIELD) {
    playerToAttackData.shield = Math.min(
      playerToAttackData.shield + 1,
      MAX_SHIELD,
    );
  } else if (
    playerToAttackData.shield >= MAX_SHIELD &&
    playerToAttackData.health >= MIN_HEALTH
  ) {
    playerToAttackData.health -= 1;
  }

  // Update user's shield and health based on game logic
  if (userData.shield < MAX_SHIELD) {
    userData.shield = Math.min(userData.shield + 1, MAX_SHIELD);
  } else if (userData.health < MAX_HEALTH && playerEliminated) {
    userData.health = Math.min(userData.health + 1, MAX_HEALTH);
  }

  // Update the database
  await update(lobbyRef, {
    [userId]: userData,
    [playerToAttackId]: playerToAttackData,
  });

  return playerEliminated;
};
export const handleIncorrectGuess = (
  lobbyRef: DatabaseReference,
  playerData: SurvivalPlayerObject,
) => {
  // update the matches, and the reveal index
};
