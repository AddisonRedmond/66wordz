import WordTile from "./word-tile";

import { m } from "framer-motion";
type WordContainerProps = {
  word?: string;
  match?: number[];
  eliminated?: boolean;
  revealAll?: boolean;
};

const WordContainer: React.FC<WordContainerProps> = ({
  word,
  ...props
}: WordContainerProps) => {
  if (word) {
    return (
      <m.div
        className={`flex h-16 w-full flex-row items-center justify-center gap-1 rounded-md border-2 border-zinc-200 bg-stone-300 px-2  py-1 duration-150 ease-in-out`}
      >
        {word.split("").map((letter: string, index: number) => {
          return (
            <WordTile
              key={index}
              letter={letter}
              revealed={props.match?.includes(index) || props?.eliminated || props.revealAll}
              revealedColor="#219C90"
              wordLength={word.length}
            />
          );
        })}
      </m.div>
    );
  }
};

export default WordContainer;
