const WordRow = (props: { word?: string }) => {
  const getColor = () => {
    return "#FFFFFF";
  };
  return (
    <div className="my-1 flex w-full flex-row items-center justify-center gap-1 rounded-md duration-150 ease-in-out h-1/5">
      {Array.from({ length: 5 }).map((_, index) => {
        return (
          <div className="grid aspect-square bg-white w-1/5 place-content-center rounded-md border-2 border-zinc-400 text-3xl font-bold  duration-200 ease-in-out">
            <p className="h-fit">{props.word? props.word.toUpperCase().split("")[index] : ""}</p>
          </div>
        );
      })}
    </div>
  );
};

const GuessGrid = () => {
  return (
    <div className="rounded-md bg-stone-300 py-2 px-3 min-h-80 min-w-72 max-w-96 w-full">
      <WordRow word="PLANE"/>
      <WordRow />
      <WordRow />
      <WordRow />
      <WordRow />
    </div>
  );
};

export default GuessGrid;
