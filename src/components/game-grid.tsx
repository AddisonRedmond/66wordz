type GameGridProps = {
  guess: string;
  guesses: string[];
};

type WordRowProps = {
  word?: string;
};

type WordTileProps = {
  letter?: string;
};

const WordTile: React.FC<WordTileProps> = (props: WordTileProps) => {
  return (
    <div className=" flex aspect-square h-[5vh] items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-[2.5vh] font-bold">
      <p>{props.letter}</p>
    </div>
  );
};

const WordRow: React.FC<WordRowProps> = (props: WordRowProps) => {
  return (
    <div className="flex gap-1">
      <WordTile key="6" letter={props.word?.[0]} />
      <WordTile key="7" letter={props.word?.[1]} />
      <WordTile key="8" letter={props.word?.[2]} />
      <WordTile key="9" letter={props.word?.[3]} />
      <WordTile key="10" letter={props.word?.[4]} />
    </div>
  );
};

const GameGrid: React.FC<GameGridProps> = ({ guess, guesses }) => {
  const handleWord = () => {
    return Array.from({ length: 6 }).map((_, index: number) => {
      if (index === 0 && !guesses.length) {
        return guess;
      } else if (guesses?.[index]) {
        return guesses[index];
      } else if (guesses?.[index - 1]) {
        return guess;
      } else {
        return null;
      }
    });

  };
  return (
    <div className="flex h-2/3 flex-col gap-2 rounded-md bg-stone-300 p-2">
      {handleWord().map((word: string, index: number) => (
        <WordRow key={index} word={word} />
      ))}
    </div>
  );
};
export default GameGrid;
