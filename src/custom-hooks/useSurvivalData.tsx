import { useEffect, useState } from "react";
import {
  ref,
  onValue,
  off,
  Database,
  DatabaseReference,
} from "firebase/database";
import { GameType } from "@prisma/client";
import { SurvivalPlayerData } from "~/utils/survival/surivival";

// todo: add word expiration timer

export type GameData = {
  lobbyData: {
    gameStarted: boolean;
    gameStartTime: number;
    winner: string;
    owner?: string;
    passkey?: string;
  };
  players: SurvivalPlayerData;
};

const useSurvialData = (
  db: DatabaseReference,
  props: {
    userId: string;
    lobbyId: string;
    gameType: GameType;
  },
) => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  useEffect(() => {
    const playersQuery = db;

    const handlePlayersDataChange = (snapshot: { val: () => GameData }) => {
      const gameData: GameData = snapshot.val();
      setGameData(gameData);
    };

    const unsubscribe = onValue(playersQuery, handlePlayersDataChange);

    return () => {
      off(playersQuery, "value", handlePlayersDataChange);
      unsubscribe();
    };
  }, [db, props.gameType, props.lobbyId]);

  return gameData;
};

export default useSurvialData;
