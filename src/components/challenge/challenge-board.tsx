import { m } from "framer-motion";
import GuessGrid from "./guess-grid";
import Keyboard from "../keyboard";
import { useOnKeyUp } from "~/custom-hooks/useOnKeyUp";
import { useState } from "react";
import useGetChallengeData from "~/custom-hooks/useGetChallengeData";
import { checkSpelling } from "~/utils/survival/surivival";
import { handleCorrectGuess, handleIncorrectGuess } from "~/utils/challenge";
import { doc } from "firebase/firestore";
import { store } from "~/utils/firebase/firebase";

type ChallengeBoardProps = {
  challengeId: string;
  userId: string;
  handleGiveUp: (lobbyId: string) => void;
};

const ChallengeBoard: React.FC<ChallengeBoardProps> = (props) => {
  const [guess, setGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>([]);

  const challengeRef = doc(store, "challenges", props.challengeId);

  const { data, error } = useGetChallengeData(challengeRef);

  const handleKeyBoardLogic = (e: KeyboardEvent | string) => {
    const key = typeof e === "string" ? e.toUpperCase() : e.key.toUpperCase();

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
        return;
      }
      if (guess === data?.word) {
        handleCorrectGuess(challengeRef);
      } else {
        handleIncorrectGuess(
          props.userId,
          challengeRef,
          guess,
          data?.[props.userId ?? ""]?.matches,
          data?.word,
        );
        setGuess("");
      }
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
      <div className="flex max-h-[90vh] min-h-[660px] min-w-[360px] flex-col items-center justify-center gap-5 rounded-md bg-white p-5 md:w-1/2">
        {/* word container */}
        <h2 className="text-2xl font-semibold">Challenge</h2>
        {/* <WordContainer word="PENIS" revealIndex={[1, 4, 3]} /> */}
        <GuessGrid
          guesses={data?.[props.userId ?? ""]?.guesses ?? []}
          guess={guess}
          word={data?.word}
        />
        {/* keyboard */}
        <Keyboard
          disabled={false}
          handleKeyBoardLogic={handleKeyBoardLogic}
          matches={data?.[props.userId ?? ""]?.matches}
        />
        <button
          onClick={() => {
            props.handleGiveUp(props.challengeId);
          }}
          className="rounded-md bg-black p-2 font-medium text-white duration-150 ease-in-out hover:bg-zinc-600"
        >
          Give Up
        </button>
      </div>
    </m.div>
  );
};

export default ChallengeBoard;
