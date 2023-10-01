import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "~/utils/firebase/firebase";
import Keyboard from "./keyboard";
import GameGrid from "./game-grid";
type PublicGameProps = {
  lobbyId: string;
};

const PublicGame: React.FC<PublicGameProps> = (props: PublicGameProps) => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const query = ref(db, `publicLobbies/${props.lobbyId}`);
    const handleDataChange = (snapShot: any) => {
      const firebaseData = snapShot.val() || {};
      setData(firebaseData);
    };

    const unsubscribe = onValue(query, handleDataChange);
    return () => {
      off(query, "value", handleDataChange);
      unsubscribe;
    };
  }, []);

  console.log(data);

  return (
    <div>
      <GameGrid />
      <Keyboard disabled={false} />
    </div>
  );
};

export default PublicGame;
