import { SetStateAction, useEffect, useState } from "react";
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
import Opponent from "./opponent";

type PublicGameProps = {
  lobbyId: string;
  userId: string;
};

type Matches = {
  fullMatch: string[];
  partialMatch: string[];
  noMatch: string[];
};

type PlayersData = {
  guesses: string[];
  word: string;
  startTime?: string;
  allGuesses: string[];
} | null;

type GameData = {
  [dynamicKey: string]: {
    [nestedKey: string]: PlayersData; // Use an appropriate type for the nested objects
  } & {
    initializedTimeStamp: string;
  };
} | null;

const PublicGame: React.FC<PublicGameProps> = (props: PublicGameProps) => {
  const [playerData, setPlayerData] = useState<PlayersData>(null);
  const [gameData, setGameData] = useState<GameData>(null);
  const [guess, setGuess] = useState<string>("");
  const [matches, setMatches] = useState<Matches>({
    fullMatch: [],
    partialMatch: [],
    noMatch: [],
  });

  console.log(gameData![props.userId]);

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
      setPlayerData(formatGameData(firebaseData));
    };

    const unsubscribe = onValue(query, handleDataChange);

    const playersQuery = ref(db, `publicLobbies/${props.lobbyId}`);
    const handlePlayersDataChange = (snapShot: any) => {
      const gameData: SetStateAction<GameData> = snapShot.val();
      setGameData(gameData);
    };

    const test = onValue(playersQuery, handlePlayersDataChange);

    return () => {
      off(query, "value", handleDataChange);
      off(playersQuery, "value", handlePlayersDataChange);

      unsubscribe();
      test();
    };
  }, [props.lobbyId]);

  useEffect(() => {
    if (playerData) {
      // console.log(data.guesses.length)
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Backspace" && guess.length > 0) {
          setGuess((prevGuess) => prevGuess.slice(0, -1));
        } else if (e.key === "Enter" && guess.length === 5) {
          // check if correct guess
          console.log("UPDATING GUESS AND GUESSES");

          updateGuessesAndAllGuesses(
            props.lobbyId,
            props.userId,
            [...playerData.guesses, guess],
            [...playerData.allGuesses, guess],
          );
          console.log(
            `length: ${playerData.guesses.length}, data: ${playerData.guesses} `,
          );

          // maybe use a .onchildchanged firebase function to fix this? Right now the updateguessesandallguesses function updates
          // , but isnt done by the time this part of the code runs
          if (guess === playerData.word) {
            handleCorrectGuess(props.lobbyId, props.userId);
            setGuess("");
            resetMatches();
            return;
          } else if (playerData.guesses.length > 5) {
            console.log("HANDIING WORD FAILURE");
            handleWordFailure(
              playerData.guesses,
              playerData.word,
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
        handleMatched(
          playerData.guesses ? playerData.guesses : [],
          playerData.word,
        ),
      );
      return () => {
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [guess, playerData]);

  console.log(gameData);

  if (playerData) {
    return (
      <div className="flex w-full items-center justify-around">
        <div className=" flex w-1/4 flex-wrap justify-around gap-y-2">
          {Array.from({ length: 36 }).map((_, index: number) => {
            return <Opponent key={index} />;
          })}
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="font-bold">Loading Players</p>
            <GameGrid
              guess={guess}
              guesses={playerData.guesses}
              word={playerData.word}
            />
          </div>

          <Keyboard disabled={false} matches={matches} />
        </div>
        <div className="flex w-1/4 flex-wrap justify-around gap-y-2">
          {Array.from({ length: 36 }).map((_, index: number) => {
            return <Opponent key={index * 2} />;
          })}
        </div>
      </div>
    );
  } else {
    return <p>An Error Occurred!</p>;
  }
};

export default PublicGame;
