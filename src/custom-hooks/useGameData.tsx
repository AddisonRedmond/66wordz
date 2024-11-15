import { useEffect, useState } from "react";
import { onValue, off, DatabaseReference } from "firebase/database";

const useGameData = <T,>(db: DatabaseReference) => {
  // Correct placement of <T>
  const [gameData, setGameData] = useState<T | null>(null);

  useEffect(() => {
    const handleGameDataChanged = (snapshot: { val: () => T }) => {
      const gameData = snapshot.val();
      setGameData(gameData);
    };

    const unsubscribe = onValue(db, handleGameDataChanged);
    return () => {
      off(db, "value", handleGameDataChanged);
      unsubscribe();
    };
  }, []);

  return gameData;
};

export default useGameData;
