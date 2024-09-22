import { DatabaseReference, child, update } from "firebase/database";
import {
  getInitials,
  getRevealIndex,
  handleGetNewWord,
  handleMatched,
} from "../game";
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
  guessCount: number;
};

export type SurvivalPlayerObject = {
  health: number;
  shield: number;
  eliminated: boolean;
  word: WordObject;
  initials?: string;
  revealIndex: number[];
  eliminatedCount: number;
  correctGuessCount: number;
  guessTimer: number;
};

export type SurvivalPlayerData = {
  [keyof: string]: SurvivalPlayerObject;
  // add new shit to player object
};

export const createNewSurivivalLobby = () => {
  return {
    lobbyData: {
      gameStarted: false,
      gameStartTime: new Date().getTime() + 30000,
      round: 1,
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
      eliminatedCount: 0,
      correctGuessCount: 0,
      guessTimer: 0,
      word: {
        guessCount: 0,
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
    .filter((id) => !players[id]?.eliminated && id !== playerId)
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

  if (position === "First") {
    return nonEliminatedPlayersOrdered[0];
  } else if (position === "Last") {
    return nonEliminatedPlayersOrdered[nonEliminatedPlayersOrdered.length - 1];
  } else {
    return validateTarget(position);
  }
};

const calculatePlayerStatus = (playerData: SurvivalPlayerObject) => {
  if (playerData.shield <= 0 && playerData.health <= MIN_HEALTH) {
    playerData.eliminated = true;
    playerData.health = 0;
    playerData.eliminated = true;
  } else if (playerData.shield > 0) {
    playerData.shield = Math.min(playerData.shield - 1, MAX_SHIELD);
  } else if (playerData.shield >= 0 && playerData.health >= MIN_HEALTH) {
    playerData.health = playerData.health - 1;
  }

  return playerData;
};

export const getGuessTimer = (round?: number) => {
  let timer = 0;
  switch (round) {
    case 1:
      timer = 45000;
      break;
    case 2:
      timer = 30000;
      break;
    case 3:
      timer = 20000;
      break;
    case 4:
      timer = 15000;
      break;
    default:
      timer = 10000;
      break;
  }

  return new Date().getTime() + timer;
};

export const handleCorrectGuess = async (
  lobbyRef: DatabaseReference,
  userId: string,
  userData: SurvivalPlayerObject,
  playerToAttackId: string,
  round: number,
  playerToAttackData?: SurvivalPlayerObject,
): Promise<boolean> => {
  if (!playerToAttackId || !playerToAttackData) {
    // TODO: add notification that there is no player to attack, or add other logic
    return Promise.reject(
      new Error("No player to attack or missing player data."),
    );
  }

  const attackedPlayerData = calculatePlayerStatus(playerToAttackData);

  // Update user's shield and health based on game logic
  if (userData.shield < MAX_SHIELD) {
    userData.shield = Math.min(userData.shield + 1, MAX_SHIELD);
  } else if (userData.health < MAX_HEALTH && attackedPlayerData.eliminated) {
    userData.health = Math.min(userData.health + 1, MAX_HEALTH);
  }

  userData.guessTimer = getGuessTimer(round);
  userData.word.matches = { full: [], partial: [], none: [] };
  userData.revealIndex = [];
  userData.word.word = handleGetNewWord();
  userData.correctGuessCount++;
  if (attackedPlayerData.eliminated) {
    userData.eliminatedCount++;
  }
  // Update the database
  const playersRef = child(lobbyRef, "players");

  await update(playersRef, {
    [userId]: userData,
    [playerToAttackId]: attackedPlayerData,
  });

  return attackedPlayerData.eliminated;
};

export const handleIncorrectGuess = async (
  lobbyRef: DatabaseReference,
  playerData: SurvivalPlayerObject,
  guess: string,
  userId: string,
) => {
  // TODO: incorrect guess increments
  const word = playerData.word.word;
  const updatedRevealIndex = getRevealIndex(
    word,
    guess,
    playerData.revealIndex,
  );
  const matches = handleMatched(guess, word, playerData.word.matches);

  const updatedPlayerData = {
    ...playerData,
  };

  updatedPlayerData.word.matches = matches;
  updatedPlayerData.revealIndex = updatedRevealIndex;

  const ref = child(lobbyRef, `players/${userId}`);

  await update(ref, { ...updatedPlayerData });
};

export const handleGuessExpired = async (
  lobbyRef: DatabaseReference,
  userId: string,
  playerData?: SurvivalPlayerObject,
  round?: number,
) => {
  if (!playerData) {
    return;
    // probably remove player from lobby
  }
  const playerStatus = calculatePlayerStatus(playerData);

  playerStatus.guessTimer = getGuessTimer(round);
  playerStatus.word.word = handleGetNewWord();
  playerStatus.word.guessCount = 0;
  playerStatus.word.matches = { full: [], partial: [], none: [] };
  playerStatus.revealIndex = [];

  const ref = child(lobbyRef, `players/${userId}`);

  await update(ref, {
    ...playerStatus,
  });

  // decrement health or shiled, or eliminate player
  // if player isnt elminated, then reset the timer, based off of the "round", get a new word, and reset the matches and guesses
};
