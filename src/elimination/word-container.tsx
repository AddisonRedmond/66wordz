import { motion } from "framer-motion";

type WordContainerProps = {
  word: string;
  guess?: string;
  matchingIndex: number[];
};

const Tile: React.FC<{ letter: string; letterMatches: boolean }> = (props: {
  letter: string;
  letterMatches: boolean;
}) => {
  return (
    <motion.p
      animate={props.letterMatches && { backgroundColor: "#00DFA2" }}
      className="flex aspect-square h-[5vh] items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-[2.5vh] font-bold"
    >
      {props.letterMatches && props.letter}
    </motion.p>
  );
};

const WordContainer: React.FC<WordContainerProps> = (
  props: WordContainerProps,
) => {
  return (
    <div className="flex h-[5vh] gap-1 text-[2.5vh]">
      {props.word.split("").map((letter: string, index: number) => {
        return (
          <Tile
            key={`${letter}${index}`}
            letter={letter}
            letterMatches={!!props.matchingIndex.includes(index)}
          />
        );
      })}
    </div>
  );
};

export default WordContainer;
