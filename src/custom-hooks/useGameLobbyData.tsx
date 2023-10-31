import { useEffect, useState } from "react";
import { ref, onValue, off, Database } from "firebase/database";

const useGameLobbyData = (
  db: Database,
  props: {
    userId: string;
    lobbyId: string;
    gameType: "MARATHON" | "ELIMINATION" | "ITEMS";
  },
) => {
  const [gameData, setGameData] = useState<any>(null);

  useEffect(() => {
    const playersQuery = ref(db, `${props.gameType}/${props.lobbyId}`);

    const handlePlayersDataChange = (snapshot: any) => {
      const gameData = snapshot.val();
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
