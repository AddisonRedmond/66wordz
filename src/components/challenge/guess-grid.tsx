type GuessGridProps = {
  guesses: string[];
  guess: string;
  word?: string;
};

const WordRow = (props: {
  guess?: string;
  word?: string;
  showColor: boolean;
}) => {
  const getColor = (index: number) => {
    if (!props.guess || !props.word) {
      return "#FFFFFF";
    }
    const splitGuess = props.guess?.split("") ?? [];
    const splitWord = props.word?.split("") ?? [];
    if (splitGuess[index] === splitWord[index]) {
      return "#00DFA2";
    } else if (splitGuess[index] && splitWord?.includes(splitGuess[index]!)) {
      return "#F6FA70";
    } else {
      return "#545B77";
    }
  };

  return (
    <div className="my-1 flex h-1/5 w-full flex-row items-center justify-center gap-1 rounded-md duration-150 ease-in-out">
      {Array.from({ length: 5 }).map((_, index) => {
        return (
          <div
            style={{
              backgroundColor: props.showColor ? getColor(index) : "#FFFFFF",
            }}
            key={index}
            className={`grid aspect-square w-12 sm:w-1/5 place-content-center rounded-md border-2 border-zinc-400 text-3xl font-bold  duration-200 ease-in-out`}
          >
            <p className="h-fit">
              {props.guess ? props.guess.toUpperCase().split("")[index] : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const GuessGrid: React.FC<GuessGridProps> = (props) => {
  const determineWord = (rowNumber: number) => {
    const guessesLength = props.guesses.length;

    if (guessesLength === 0 && rowNumber === 0) {
      return props.guess;
    }

    if (rowNumber === guessesLength) {
      return props.guess;
    }

    return props.guesses[rowNumber];
  };
  const showColor = (index: number) => {
    const guessesLength = props.guesses.length;
    return guessesLength > index;
  };
  return (
    <div className=" min-h-72 sm:w-full w-fit max-w-96 rounded-md bg-stone-300 px-3 py-2">
      {Array.from({ length: 5 }).map((_, index) => {
        return (
          <WordRow
            key={index}
            guess={determineWord(index)}
            word={props.word}
            showColor={showColor(index)}
          />
        );
      })}
    </div>
  );
};

export default GuessGrid;
