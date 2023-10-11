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

const GameGrid: React.FC<GameGridProps> = (props: GameGridProps) => {
  const handleWord = () => {
    let rows = [];
    for (let i = 0; i < 6; i++) {
      if (i === 0 && !props.guesses.length) {
        rows.push(<WordRow key={i} word={props.guess} />);
      } else if (props.guesses?.[i]) {
        rows.push(<WordRow key={i} word={props.guesses[i]} />);
      } else if (props.guesses?.[i - 1]) {
        rows.push(<WordRow key={i} word={props.guess} />);
      } else {
        rows.push(<WordRow key={i} />);
      }
    }
    return rows;
  };
  return (
    <div className="flex h-2/3 flex-col gap-2 rounded-md bg-stone-300 p-2">
      {handleWord().map((wordRow: JSX.Element, index: number) => {
        return wordRow;
      })}
    </div>
  );
};

export default GameGrid;
