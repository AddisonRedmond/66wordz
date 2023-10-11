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
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guess, setGuess] = useState<string>("");
  const [word, setWord] = useState<string>("GUESS");

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && guess.length > 0) {
        setGuess((prevGuess) => prevGuess.slice(0, -1));
      } else if (e.key === "Enter") {
        setGuesses((prevGuesses) => [...prevGuesses, guess]);
        setGuess("")
      } else if (
        /[a-zA-Z]/.test(e.key) &&
        e.key.length === 1 &&
        guess.length < 5
      ) {
        setGuess((prevGuess) => `${prevGuess}${e.key}`.toUpperCase());
      }
    };

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [guess]);

  useEffect(() => {
    const query = ref(db, `publicLobbies/${props.lobbyId}`);
    const handleDataChange = (snapShot: any) => {
      const firebaseData = snapShot.val() || {};
      setData(firebaseData);
    };

    const unsubscribe = onValue(query, handleDataChange);

    return () => {
      off(query, "value", handleDataChange);
      unsubscribe();
    };
  }, [props.lobbyId]);

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
