import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { Dispatch, SetStateAction, useEffect } from "react";
import { handleColor } from "~/utils/game";

type GameGridProps = {
  guess: string;
  guesses: string[];
  word: string;
  disabled: boolean;
  rows: number;
  spellCheck: boolean;
  setSpellCheck: Dispatch<SetStateAction<boolean>>;
};

type WordRowProps = {
  guess?: string;
  word: string;
  match: boolean;
  spellCheck: boolean;
  setSpellCheck: Dispatch<SetStateAction<boolean>>;
};

type WordTileProps = {
  letter?: string;
  word: string;
  index: number;
  match: boolean;
};

const WordTile: React.FC<WordTileProps> = ({
  letter,
  word,
  index,
  match,
}: WordTileProps) => {
  return (
    <motion.div
      initial={{ backgroundColor: "#F5F5F4" }}
      animate={
        match
          ? { backgroundColor: handleColor(letter, word, index) }
          : { backgroundColor: "#F5F5F4" }
      }
      className=" flex aspect-square h-[5vh] items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-[2.5vh] font-bold"
    >
      <AnimatePresence>
        {letter && (
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.07 }}
          >
            {letter}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WordRow: React.FC<WordRowProps> = (props: WordRowProps) => {
  const [scope, animate] = useAnimate();

  const control = {
    x: [-10, 10, -10, 10, 0],
  };
  useEffect(() => {
    animate(scope.current, control, { duration: 0.3 });

    props.setSpellCheck(false);
  }, [props.spellCheck]);
  return (
    <motion.div ref={scope} className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index: number) => {
        return (
          <WordTile
            key={index}
            word={props.word}
            letter={props.guess?.[index]}
            index={index}
            match={props.match}
          />
        );
      })}
    </motion.div>
  );
};

const GameGrid: React.FC<GameGridProps> = ({
  guess,
  guesses,
  word,
  disabled,
  rows,
  spellCheck,
  setSpellCheck,
}) => {
  const handleWord = () => {
    return Array.from({ length: rows }).map((_, index: number) => {
      if (index === 0 && !guesses.length) {
        return guess;
      } else if (guesses?.[index]) {
        return guesses[index] ?? ""; // Use an empty string if guesses[index] is undefined
      } else if (guesses?.[index - 1]) {
        return guess;
      } else {
        return "";
      }
    });
  };

  const handleMatches = (guessIndex: number): boolean => {
    if (guesses?.[guessIndex]) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div
      className={`flex h-2/3 w-fit flex-col gap-2 rounded-md bg-stone-300 p-2 ${
        disabled ? "opacity-30" : "opacity-100"
      } ${disabled && "cursor-not-allowed"}`}
    >
      {handleWord().map((guess: string, index: number) => (
        <WordRow
          key={index}
          guess={guess}
          word={word}
          match={handleMatches(index)}
          spellCheck={spellCheck}
          setSpellCheck={setSpellCheck}
        />
      ))}
    </div>
  );
};
export default GameGrid;
