type WordContainerProps = {};

const WordContainer: React.FC = () => {
  return (
    <div className="flex h-[5vh] gap-1 text-[2.5vh]">
      <p className="flex aspect-square h-[5vh] items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-[2.5vh] font-bold">
        G
      </p>
      <p className="flex aspect-square h-[5vh] items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-[2.5vh] font-bold">
        U
      </p>
      <p className="flex aspect-square h-[5vh] items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-[2.5vh] font-bold">
        E
      </p>
      <p className="flex aspect-square h-[5vh] items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-[2.5vh] font-bold">
        S
      </p>
      <p className="flex aspect-square h-[5vh] items-center justify-center rounded-md border-2 border-neutral-500 bg-stone-100 text-[2.5vh] font-bold">
        S
      </p>
    </div>
  );
};

export default WordContainer;
