import WordTile from "./word-tile";

import { m } from "framer-motion";
type GuessContainerProps = {
  word?: string;
  wordLength: number;
};

const GuessContainer: React.FC<GuessContainerProps> = ({
  word,
  wordLength,
}) => {
    return (
      <m.div
        className={`flex h-16 w-full flex-row items-center justify-center gap-1 rounded-md border-2 border-zinc-200 bg-stone-300 px-2  py-1 duration-150 ease-in-out`}
      >
        {word?.split("").map((letter: string, index: number) => {
          return (
            <WordTile
              key={index}
              letter={letter}
              revealed={true}
              revealedColor="white"
              wordLength={wordLength}
            />
          );
        })}
      </m.div>
    );
  }


export default GuessContainer;
