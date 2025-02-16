import { m } from "framer-motion";
import GuessGrid from "./guess-grid";
import Keyboard from "../board-components/keyboard";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useState } from "react";
import useGetChallengeData from "~/custom-hooks/useGetChallengeData";
import { checkSpelling } from "~/utils/spellCheck";
import { handleGuess } from "~/utils/challenge";
import { doc } from "firebase/firestore";
import { store } from "~/utils/firebase/firebase";
import Results from "./results";
import { api } from "~/utils/api";

type ChallengeBoardProps = {
  challengeId: string;
  userId: string;
  handleGiveUp: (lobbyId: string) => void;
  handleCloseChallenge: () => void;
};

const ChallengeBoard: React.FC<ChallengeBoardProps> = (props) => {
  const [guess, setGuess] = useState<string>("");
  const [spellCheck, setSpellCheck] = useState(false);

  const challengeRef = doc(store, "challenges", props.challengeId);
  const { data } = useGetChallengeData(challengeRef);

  const calculateWinner = api.challenge.calculateWinner.useMutation();
  const gameFinished = api.challenge.gameFinished.useMutation();

  const handleCalculateWinner = (challengeId: string) => {
    calculateWinner.mutate(challengeId);
  };

  const handleGiveUp = (challengeId: string) => {
    props.handleGiveUp(props.challengeId);
    handleCalculateWinner(challengeId);
  };

  const handleGameFinished = async (success: boolean, guess: string) => {
    const guesses = [...(data![props.userId]?.guesses ?? []), guess];
    const input = {
      userId: props.userId,
      challengeId: props.challengeId,
      success: success,
      completed: true,
      guesses: guesses,
    };
    await gameFinished.mutateAsync(input);
    handleCalculateWinner(props.challengeId);
  };

  const handleKeyBoardLogic = (e: KeyboardEvent | string) => {
    if (!navigator.onLine) return;
    const key = typeof e === "string" ? e.toUpperCase() : e.key.toUpperCase();

    if (
      (data?.[props.userId]?.guesses?.length ?? 0) >= 5 ||
      data?.[props.userId]?.completed !== undefined
    ) {
      return;
    }
    if (key === "BACKSPACE") {
      if (guess.length === 0) return;
      setGuess((prev) => prev.slice(0, -1));
    }

    if (/[a-zA-Z]/.test(key) && key.length === 1 && guess.length < 5) {
      setGuess((prev) => prev + key);
    }

    if (key === "ENTER" && guess.length === 5) {
      // check spelling
      if (checkSpelling(guess) === false) {
        setSpellCheck(true);
        return;
      }

      const guessesArray = data?.[props.userId]?.guesses ?? [];
      if (guess === data?.word && guessesArray.length < 5) {
        // mutate gameover success
        handleGameFinished(true, guess);
      } else if (guessesArray.length + 1 >= 5) {
        // mutate gameover failure
        handleGameFinished(false, guess);
      } else {
        handleGuess(
          props.userId,
          challengeRef,
          guess,
          data?.[props.userId ?? ""]?.matches,
          data?.word,
          data?.[props.userId]?.guesses,
        );
      }

      setGuess("");

      // handle correct
      // check if correct guess => handle correct guess
      // check if incorrect guess => handle incorrect guess
    }
  };

  useOnKeyUp(handleKeyBoardLogic, [guess]);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-400 bg-opacity-50"
    >
      <div className="relative flex max-h-[90vh] min-h-[660px] min-w-[360px] flex-col items-center justify-center gap-4 overflow-hidden rounded-md bg-white p-5 md:w-1/2">
        <div
          style={{
            transform:
              data?.[props.userId]?.completed !== undefined
                ? "translateX(0%)"
                : "translateX(100%)",
          }}
          className="absolute h-full w-full bg-white duration-150 ease-in-out"
        >
          {data?.[props.userId]?.completed !== undefined && (
            <Results challengeData={data} />
          )}
        </div>

        <div className="absolute right-1 top-1">
          <button
            onClick={() => props.handleCloseChallenge()}
            className="z-10 rounded-full p-1 duration-150 ease-in-out hover:bg-zinc-200"
          >
            ✖️
          </button>
        </div>
        <h2 className="text-2xl font-semibold">Challenge</h2>

        {data?.[props.userId]?.completed === undefined && (
          <>
            <GuessGrid
              guesses={data?.[props.userId ?? ""]?.guesses ?? []}
              guess={guess}
              word={data?.word}
              setSpellCheck={setSpellCheck}
              spellCheck={spellCheck}
            />
            <div className="w-full">
              <Keyboard
                disabled={false}
                handleKeyBoardLogic={handleKeyBoardLogic}
                matches={data?.[props.userId ?? ""]?.matches}
              />
            </div>

            {!data?.[props.userId]?.completed && (
              <button
                onClick={() => {
                  handleGiveUp(props.challengeId);
                }}
                className="rounded-md bg-black p-2 font-medium text-white duration-150 ease-in-out hover:bg-zinc-600"
              >
                Give Up
              </button>
            )}
          </>
        )}
      </div>
    </m.div>
  );
};

export default ChallengeBoard;
