import { ref, set, update, remove } from "firebase/database";
import { db } from "./firebase";

export const startUserTimer = async (userId: string, lobbyId: string) => {
  await update(ref(db, `MARATHON/${lobbyId}/players/${userId}`), {
    timer: new Date().getTime() + 180000,
  });
};

export const startSoloGame = async (lobbyId: string) => {
  await update(ref(db, `MARATHON/${lobbyId}/lobbyData`), { gameStarted: true });
};
