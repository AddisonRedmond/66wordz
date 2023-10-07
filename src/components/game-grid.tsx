const WordTile: React.FC = () => {
  return (
    <div className=" border-2 aspect-square w-14 rounded-md bg-stone-100 border-neutral-500"></div>
  );
};

const WordRow: React.FC = () => {
  return (
    <div className="flex gap-1">
      <WordTile />
      <WordTile />
      <WordTile />
      <WordTile />
      <WordTile />
    </div>
  );
};

const GameGrid: React.FC = () => {
  return (
    <div className="h-2/3 flex flex-col gap-2 bg-stone-300 rounded-md p-2">
      <WordRow />
      <WordRow />
      <WordRow />
      <WordRow />
      <WordRow />
      <WordRow />

    </div>
  );
};

export default GameGrid;
