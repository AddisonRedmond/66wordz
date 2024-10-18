const GameInfo: React.FC = () => {
  return (
    <div className="flex h-16 w-2/4 min-w-60 items-center">
      <div className="grid aspect-square h-full place-items-center rounded-l-lg border-2 border-zinc-600">
        <p>Points</p>
        <p className="text-xl font-semibold">10</p>
      </div>
      <div className="flex h-full w-full flex-col justify-center rounded-r-lg border-2 border-black bg-black px-3 text-white">
        <p className="font-semibold">Next Elimination</p>
        <p>1 min 12 sec</p>
      </div>
    </div>
  );
};

export default GameInfo;
