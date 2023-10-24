import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import {
  db,
  handleStartTimer,
  updateGuessesAndAllGuesses,
} from "~/utils/firebase/firebase";
import Keyboard from "./keyboard";
import GameGrid from "./game-grid";
import {
  formatGameData,
  handleCorrectGuess,
  handleMatched,
  handleWordFailure,
} from "~/utils/game";
import Opponent from "./opponent";
import Timer from "./timer";

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
    if (gameData?.gameStarted === true && !gameData?.players[props.userId].timer ) {
      handleStartTimer(props.lobbyId, props.userId);
    }
  }, [gameData?.gameStarted]);

  useEffect(() => {
    if (gameData?.players[props.userId] && gameData.gameStarted) {
      const playerData = formatGameData(gameData.players[props.userId]);
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Backspace" && guess.length > 0) {
          setGuess((prevGuess) => prevGuess.slice(0, -1));
        } else if (e.key === "Enter" && guess.length === 5) {
          // check if correct guess

          updateGuessesAndAllGuesses(
            props.lobbyId,
            props.userId,
            [...playerData.guesses, guess],
            [...playerData.allGuesses, guess],
          );

          // maybe use a .onchildchanged firebase function to fix this? Right now the updateguessesandallguesses function updates
          // , but isnt done by the time this part of the code runs
          if (guess === playerData.word) {
            handleCorrectGuess(
              props.lobbyId,
              props.userId,
              playerData.timer,
              playerData.guesses.length,
            );
            setGuess("");
            resetMatches();
            return;
          } else if (playerData.guesses.length > 4) {
            handleWordFailure(
              playerData.guesses,
              playerData.word,
              props.lobbyId,
              props.userId,
              gameData.players[props.userId].timer,
            );
            setGuess("");
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

  if (gameData?.players[props.userId]) {
    const playerData = formatGameData(gameData.players[props.userId]);
    return (
      <div className="flex w-full items-center justify-around">
        <div className=" flex w-1/4 flex-wrap justify-around gap-y-2">
          {Object.keys(gameData.players).map(
            (playerId: string, index: number) => {
              const { word, guesses } = gameData.players[playerId];
              if (playerId === props.userId) {
                return;
              } else if (index % 2 == 0)
                return (
                  <Opponent
                    word={word}
                    guesses={guesses}
                    id={playerId}
                    key={playerId}
                  />
                );
            },
          )}
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="font-bold">{`Loading Players : ${
              Object.keys(gameData.players).length
            } of 66`}</p>
            <Timer expiryTimestamp={new Date(playerData.timer)} />
            <GameGrid
              guess={guess}
              guesses={playerData?.guesses}
              word={playerData?.word}
              disabled={!gameData.gameStarted}
            />
          </div>

          <Keyboard disabled={!gameData.gameStarted} matches={matches} />
        </div>
        <div className="flex w-1/4 flex-wrap justify-around gap-y-2">
          {Object.keys(gameData.players).map(
            (playerId: string, index: number) => {
              const { word, guesses } = gameData.players[playerId];
              if (playerId === props.userId) {
                return;
              } else if (index % 2 !== 0)
                return (
                  <Opponent
                    word={word}
                    guesses={guesses}
                    id={playerId}
                    key={playerId}
                  />
                );
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
