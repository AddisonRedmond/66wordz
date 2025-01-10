import { useEffect, useState } from "react";
import { ref, onValue, off, Database } from "firebase/database";
import { GameType } from "@prisma/client";
import { DefaultPlayerData } from "~/utils/game";
import { EliminationLobbyData } from "~/utils/elimination";
export interface EliminationPlayerObject extends DefaultPlayerData {}

export type EliminationPlayerData = {
  [keyof: string]: EliminationPlayerObject;
};

export type GameData = {
  lobbyData: EliminationLobbyData;
  players: EliminationPlayerData;
};

const useEliminationData = (
  db: Database,
  props: {
    lobbyId: string;
    gameType: GameType;
  },
) => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  useEffect(() => {
    const playersQuery = ref(db, `${props.gameType}/${props.lobbyId}`);

    const handlePlayersDataChange = (snapshot: { val: () => GameData }) => {
      const gameData: GameData = snapshot.val();
      setGameData(gameData);
    };

    const unsubscribe = onValue(playersQuery, handlePlayersDataChange);

    return () => {
      off(playersQuery, "value", handlePlayersDataChange);
      unsubscribe();
    };
  }, []);

  return gameData;
};

export default useEliminationData;
