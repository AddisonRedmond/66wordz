import SurvivalTile from "./survival-tile";

import { m } from "framer-motion";
type WordContainerProps = {
  word?: string;
  match?: string[];
  eliminated?: boolean;
};

const WordContainer: React.FC<WordContainerProps> = ({
  word,
  ...props
}: WordContainerProps) => {
  if (word) {
    return (
      <m.div
        className={`flex w-fit flex-row items-center justify-center gap-1 rounded-md border-2 border-zinc-200 bg-stone-300 px-2  py-1 duration-150 ease-in-out`}
      >
        {word.split("").map((letter: string, index: number) => {
          return (
            <SurvivalTile
              key={index}
              letter={letter}
              revealed={props.match?.includes(letter) || props?.eliminated}
            />
          );
        })}
      </m.div>
    );
  }
};

export default WordContainer;
