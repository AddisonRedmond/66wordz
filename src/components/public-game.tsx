import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "~/utils/firebase/firebase";
import Keyboard from "./keyboard";
import GameGrid from "./game-grid";
import { handleKeyPress, handleSubmit } from "~/utils/game-grid";
type PublicGameProps = {
  lobbyId: string;
};

const PublicGame: React.FC<PublicGameProps> = (props: PublicGameProps) => {
  const [data, setData] = useState<any>();
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guess, setGuess] = useState<string>("");
  const [word, setWord] = useState<string>("GUESS");

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      // handle delete letter
    } else if (e.key === "Enter") {
      // handle guess check
    } else if (/[a-zA-Z]/.test(e.key)) {
      // handle add letter to guess
    }
  };

  useEffect(() => {
    const query = ref(db, `publicLobbies/${props.lobbyId}`);
    const handleDataChange = (snapShot: any) => {
      const firebaseData = snapShot.val() || {};
      setData(firebaseData);
    };
    window.addEventListener("keyup", handleKeyUp);
    const unsubscribe = onValue(query, handleDataChange);
    return () => {
      off(query, "value", handleDataChange);
      unsubscribe;
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <div className="text-center">
        <p className="font-bold">Loading Players</p>
        <GameGrid guess={guess} guesses={guesses} />
      </div>

      <Keyboard disabled={false} />
    </>
  );
};

export default PublicGame;
