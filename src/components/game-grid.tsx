import { motion } from "framer-motion";

type GameGridProps = {
  guess: string;
  guesses: string[];
  word: string;
};

type WordRowProps = {
  guess?: string;
  word: string;
  match: boolean;
};

type WordTileProps = {
  letter?: string;
  word: string;
  index: number;
  match: boolean;
};

const WordTile: React.FC<WordTileProps> = (props: WordTileProps) => {
  const handleColor = () => {
    if (props.letter) {
      if (!props.word?.split("").includes(props.letter)) {
        return "#545B77";
      } else if (props.letter === props.word?.split("")[props.index]) {
        return "#00DFA2";
      } else if (props.word?.split("").includes(props.letter)) {
        return "#F6FA70";
      }
    }
  };

  return (
    <motion.div
      initial={{ backgroundColor: "#F5F5F4" }}
      animate={
        props.match
          ? { backgroundColor: handleColor() }
          : { backgroundColor: "#F5F5F4" }
      }
      className=" flex aspect-square h-[5vh] items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-[2.5vh] font-bold"
    >
      <p>{props.letter}</p>
    </motion.div>
  );
};

const WordRow: React.FC<WordRowProps> = (props: WordRowProps) => {
  return (
    <div className="flex gap-1">
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
    </div>
  );
};

const GameGrid: React.FC<GameGridProps> = ({ guess, guesses, word }) => {
  const handleWord = () => {
    return Array.from({ length: 6 }).map((_, index: number) => {
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
    <div className="flex h-2/3 flex-col gap-2 rounded-md bg-stone-300 p-2">
      {handleWord().map((guess: string, index: number) => (
        <WordRow
          key={index}
          guess={guess}
          word={word}
          match={handleMatches(index)}
        />
      ))}
    </div>
  );
};
export default GameGrid;
