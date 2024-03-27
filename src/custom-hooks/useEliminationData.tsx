import { useEffect, useState } from "react";
import { ref, onValue, off, Database } from "firebase/database";
import { GameType } from "@prisma/client";
export type EliminationLobbyData = {
  gameStarted: boolean;
  round: number;
  nextRoundStartTime?: Date;
  gameStartTimer: number;
  roundTimer?: number;
  pointsGoal: number;
};

export type EliminationPlayerData = {
  [keyof: string]: {
    points: number;
    initials?: string;
    isBot: boolean;
    word: string;
    wordValue: number;
    matchingIndexs?: {
      full: string[];
      partial: string[];
      none: string[];
    };
    revealIndex?: number[];
  };
};

export type GameData = {
  lobbyData: EliminationLobbyData;
  players: EliminationPlayerData;
};

const useEliminationData = (
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

export default useEliminationData;
