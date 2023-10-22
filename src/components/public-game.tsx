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

const PublicGame: React.FC<PublicGameProps> = (props: PublicGameProps) => {
  const [gameData, setGameData] = useState<any>(null);
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
    const playersQuery = ref(db, `publicLobbies/${props.lobbyId}`);
    const handlePlayersDataChange = (snapShot: any) => {
      const gameData: any = snapShot.val();
      setGameData(gameData);
    };

    const unsubscribe = onValue(playersQuery, handlePlayersDataChange);

    return () => {
      off(playersQuery, "value", handlePlayersDataChange);

      unsubscribe();
    };
  }, [props.lobbyId]);

  useEffect(() => {
    if (gameData?.players[props.userId]) {
      const playerData = formatGameData(gameData[props.userId]);
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
  }, [guess, gameData]);

  console.log(gameData);

  if (gameData?.players[props.userId]) {
    const playerData = formatGameData(gameData[props.userId]);
    return (
      <div className="flex w-full items-center justify-around">
        <div className=" flex w-1/4 flex-wrap justify-around gap-y-2">
          {Object.keys(gameData.players).map(
            (playerId: string, index: number) => {
              if (playerId === props.userId) {
                return;
              } else if (index % 2 == 0) return <Opponent key={playerId} />;
            },
          )}
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="font-bold">{`Loading Players : ${
              Object.keys(gameData.players).length
            } of 66`}</p>
            <GameGrid
              guess={guess}
              guesses={playerData?.guesses}
              word={playerData?.word}
            />
          </div>

          <Keyboard disabled={false} matches={matches} />
        </div>
        <div className="flex w-1/4 flex-wrap justify-around gap-y-2">
          {Object.keys(gameData.players).map(
            (playerId: string, index: number) => {
              if (playerId === props.userId) {
                return;
              } else if (index % 2 !== 0) return <Opponent key={playerId} />;
            },
          )}
        </div>
      </div>
    );
  } else {
    return <p>An Error Occurred!</p>;
  }
};

export default PublicGame;
