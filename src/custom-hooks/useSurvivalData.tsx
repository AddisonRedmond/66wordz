import { useEffect, useState } from "react";
import { onValue, off, DatabaseReference } from "firebase/database";
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
  }, []);

  return gameData;
};

export default useSurvialData;
