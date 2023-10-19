import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db, updateGuessesAndAllGuesses } from "~/utils/firebase/firebase";
import Keyboard from "./keyboard";
import GameGrid from "./game-grid";
import {
  formatGameData,
  handleCorrectGuess,
  handleMatched,
  handleWordFailure,
} from "~/utils/game";

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

  const resetMatches = () => {
    setMatches({
      fullMatch: [],
      partialMatch: [],
      noMatch: [],
    });
  };

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

  useEffect(() => {
    if (data) {
      // console.log(data.guesses.length)
      const handleKeyUp = async (e: KeyboardEvent) => {
        if (e.key === "Backspace" && guess.length > 0) {
          setGuess((prevGuess) => prevGuess.slice(0, -1));
        } else if (e.key === "Enter" && guess.length === 5) {
          // check if correct guess
          console.log("UPDATING GUESS AND GUESSES");

          await updateGuessesAndAllGuesses(
            props.lobbyId,
            props.userId,
            [...data.guesses, guess],
            [...data.allGuesses, guess],
          );
          console.log(`length: ${data.guesses.length}, data: ${data.guesses} `);

          // maybe use a .onchildchanged firebase function to fix this? Right now the updateguessesandallguesses function updates
          // , but isnt done by the time this part of the code runs
          if (guess === data.word) {
            handleCorrectGuess(props.lobbyId, props.userId);
            setGuess("");
            resetMatches();
            return;
          } else if (data.guesses.length > 5) {
            console.log("HANDIING WORD FAILURE");
            handleWordFailure(
              data.guesses,
              data.word,
              props.lobbyId,
              props.userId,
            );
            return;
          }

          // if not
          // check if final guess

          // if not

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

  // console.log(data);

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
