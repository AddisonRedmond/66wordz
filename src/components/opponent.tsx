const Opponent: React.FC = () => {
  return (
    <div className="flex flex-col gap-1 border-gray-400 border-2 p-1 rounded-md">
      {Array.from({ length: 5 }).map((_, index: number) => {
        return (
          <div key={index} className="flex flex-row gap-1">
            {<>{Array.from({ length: 5 }).map((_, tileIndex: number) => {
                return<div key={`${tileIndex}${index}`} className="aspect-square w-2 bg-black"></div>
            })}</>}
          </div>
        );
      })}
    </div>
  );
};

export default Opponent;
