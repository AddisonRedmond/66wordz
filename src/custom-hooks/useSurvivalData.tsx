import { useEffect, useState } from "react";
import { ref, onValue, off, Database } from "firebase/database";
import { GameType } from "@prisma/client";

type WordType = "shield" | "health";

interface WordObject {
  [key: string]: {
    word: string;
    type: "shield" | "health";
    value: number;
    revealedIndex: number[] | undefined;
    attack: number;
  };
}
export type GameData = {
  lobbyData: {
    gameStarted: boolean;
    gameStartTime: number;
    damageValue: number;
    damageTimer: number;
  };
  words: WordObject;
  players: {
    [id: string]: {
      health: number;
      shield: number;
      attack: number;
    };
  };
};
const useSurvialData = (
  db: Database,
  props: {
    userId: string;
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
  }, [db, props.gameType, props.lobbyId]);

  return gameData;
};

export default useSurvialData;
