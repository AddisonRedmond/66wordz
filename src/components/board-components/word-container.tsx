import { useState } from "react";
import WordTile from "./word-tile";

type WordContainerProps = {
  word?: string;
  match?: number[];
  eliminated?: boolean;
  revealAll?: boolean;
};

// each border of the div, is 25%, 
const WordContainer: React.FC<WordContainerProps> = ({
  word,
  ...props
}: WordContainerProps) => {
  const [progress, setProgress] = useState(90);
  if (word) {
    return (
      <div
        className={`test relative flex h-16 flex-row items-center justify-center gap-1 rounded-md bg-stone-300 px-2  py-1 duration-150 ease-in-out`}
      >
        <style jsx>
          {`
            .test:before {
              content: "";
              position: absolute;
              left: 0;
              top: 0;
              width: 0;
              height: 0;
              border-top: 2px solid white;
            }
          `}
        </style>
        {word.split("").map((letter: string, index: number) => {
          return (
            <WordTile
              key={index}
              letter={letter}
              revealed={
                props.match?.includes(index) ||
                props?.eliminated ||
                props.revealAll
              }
              revealedColor="#00DFA2"
              wordLength={word.length}
            />
          );
        })}
      </div>
    );
  }
};

export default WordContainer;
