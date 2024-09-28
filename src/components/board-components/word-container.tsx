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
  if (word) {
    return (
      <div
        className={`flex h-16 flex-row items-center justify-center w-full gap-1 rounded-md bg-stone-300 px-2  py-1 duration-150 ease-in-out`}
      >
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
