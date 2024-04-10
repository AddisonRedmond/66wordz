import { useEffect, useState } from "react";
import { ref, onValue, off, Database } from "firebase/database";
import { GameType } from "@prisma/client";
export type EliminationLobbyData = {
  gameStarted: boolean;
  round: number;
  nextRoundStartTime?: number;
  gameStartTime: number;
  roundTimer?: number;
  pointsGoal: number;
  winner?: string;
  totalSpots: number;
  finalRound: boolean;
  owner?: string;
};

export type EliminationPlayerPoints = {
  [keyof: string]: { points: number };
};

export type EliminationPlayerObject = {
  initials?: string;
  isBot: boolean;
  word: string;
  wordValue: number;
  matches?: {
    full: string[];
    partial: string[];
    none: string[];
  };
  revealIndex?: number[];
  eliminated?: boolean;
};

export type EliminationPlayerData = {
  [keyof: string]: EliminationPlayerObject;
};

export type GameData = {
  lobbyData: EliminationLobbyData;
  players: EliminationPlayerData;
  playerPoints?: EliminationPlayerPoints;
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
  }, [db, props.gameType, props.lobbyId]);

  return gameData;
};

export default useEliminationData;
