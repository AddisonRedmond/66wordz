import { useEffect, useState } from "react";
import { ref, onValue, off, Database } from "firebase/database";

type LobbyData = {
  gameStarted: boolean;
  round: number;
  word: string;
  nextRoundStartTime?: Date;
  gameStartTimer?: number;
  previousWord?: string;
  roundTimer: number;
};

export type PlayerPoints = {
  [keyof: string]: {
    points: number;
  };
};

type RoundData = {
  [keyof: string]: {
    guessCount: number;
    matchingIndex?: number[];
  };
};
export type GameData = {
  players: never[];
  lobbyData: LobbyData;
  playerPoints: PlayerPoints;
  roundData?: RoundData;
  winner?: { [keyof: string]: string };
  botPoints?: PlayerPoints;
};

const useGameLobbyData = (
  db: Database,
  props: {
    userId: string;
    lobbyId: string;
    gameType: "MARATHON" | "ELIMINATION" | "ITEMS";
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

export default useGameLobbyData;
