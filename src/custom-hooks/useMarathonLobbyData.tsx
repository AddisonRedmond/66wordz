import { useEffect, useState } from "react";
import { ref, onValue, off, Database } from "firebase/database";

export type GameData = {
  lobbyData: { gameStarted: boolean; startTimer: number };
  players: {
    [keyof: string]: {
      guessCount: number;
      word: string;
      timer: number;
      allGuesses: string[];
    };
  };
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
