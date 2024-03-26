import { ref, set, update } from "firebase/database";
import { db } from "./firebase/firebase";
import {
  EliminationLobbyData,
  EliminationPlayerData,
} from "~/custom-hooks/useEliminationData";
import { getInitials } from "./game";

export const createNewEliminationLobby = async (lobbyId: string) => {
  const lobbyData: EliminationLobbyData = {
    gameStarted: false,
    round: 1,
    roundTimer: 120000,
    pointsGoal: 300,
  };
  await set(ref(db, `ELIMINATION/${lobbyId}`), {
    lobbyData: lobbyData,
  });
};

export const joinEliminationLobby = async (
  playerId: string,
  lobbyId: string,
  userName: string,
) => {
  const player: EliminationPlayerData = {
    [playerId]: { points: 0, isBot: false, initials: getInitials(userName) },
  };

  await update(ref(db, `ELIMINATION/${lobbyId}`), {
    players: player,
  });
};
