import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db, updateGuessAndGuesses } from "~/utils/firebase/firebase";
import Keyboard from "./keyboard";
import GameGrid from "./game-grid";
import { formatGameData, handleMatched } from "~/utils/game";

type PublicGameProps = {
  lobbyId: string;
  userId: string;
};

type Matches = {
  fullMatch: string[];
  partialMatch: string[];
  noMatch: string[];
};

type GameData = {
  guesses: string[];
  word: string;
  startTime?: string;
  allGuesses: string[];
} | null;

const PublicGame: React.FC<PublicGameProps> = (props: PublicGameProps) => {
  const [data, setData] = useState<GameData>(null);
  const [guess, setGuess] = useState<string>("");
  const [matches, setMatches] = useState<Matches>({
    fullMatch: [],
    partialMatch: [],
    noMatch: [],
  });

  useEffect(() => {
    if (data) {
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Backspace" && guess.length > 0) {
          setGuess((prevGuess) => prevGuess.slice(0, -1));
        } else if (e.key === "Enter" && guess.length === 5) {
          updateGuessAndGuesses(
            props.lobbyId,
            props.userId,
            [...data.guesses, guess],
            [...data.allGuesses, guess],
          );
          setGuess("");
        } else if (
          /[a-zA-Z]/.test(e.key) &&
          e.key.length === 1 &&
          guess.length < 5
        ) {
          setGuess((prevGuess) => `${prevGuess}${e.key}`.toUpperCase());
        }
      };

      window.addEventListener("keyup", handleKeyUp);
      setMatches(() =>
        handleMatched(data.guesses ? data.guesses : [], data.word),
      );
      return () => {
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [guess, data]);

  useEffect(() => {
    const query = ref(db, `publicLobbies/${props.lobbyId}/${props.userId}`);
    const handleDataChange = (snapShot: any) => {
      const firebaseData: {
        guesses?: string[];
        word?: string;
        startTime?: string;
        allGuesses?: string[];
      } = snapShot.val();
      setData(formatGameData(firebaseData));
    };

    const unsubscribe = onValue(query, handleDataChange);

    return () => {
      off(query, "value", handleDataChange);
      unsubscribe();
    };
  }, [props.lobbyId]);

  if (data) {
    return (
      <>
        <div className="text-center">
          <p className="font-bold">Loading Players</p>
          <GameGrid guess={guess} guesses={data.guesses} word={data.word} />
        </div>

        <Keyboard disabled={false} matches={matches} />
      </>
    );
  } else {
    return <p>An Error Occurred!</p>;
  }
};

export default PublicGame;
