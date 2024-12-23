import Image from "next/image";
import { m } from "framer-motion";
import { Matches } from "~/utils/game";
type KeyboardProps = {
  disabled?: boolean;
  matches?: Matches;
  handleKeyBoardLogic: (letter: string) => void;
};

const KeyboardRow = ({
  letters,
  specialKey,
  matches,
  disabled,
  handleKeyBoardLogic,
}: {
  letters: string;
  specialKey?: JSX.Element;
  matches: Matches;
  disabled: boolean;
  handleKeyBoardLogic: (letter: string) => void;
}) => {
  const handleColors = (letter: string) => {
    if (!matches) return "#e5e5e5";
    if (matches?.full?.includes(letter)) {
      return "#00DFA2";
    } else if (matches?.partial?.includes(letter)) {
      return "#F6FA70";
    } else if (matches?.none?.includes(letter)) {
      return "#545B77";
    }
    return "#e5e5e5";
  };
  return (
    <>
      {letters.split("").map((letter: string) => {
        return (
          <m.button
            onClick={() => handleKeyBoardLogic(letter)}
            animate={{
              backgroundColor: handleColors(letter),
              color: handleColors(letter) === "#545B77" ? "#FFFFFF" : "#000000",
            }}
            style={{ width: "10%" }}
            className={`flex h-full max-w-12 sm:aspect-square sm:h-auto ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            } items-center justify-center rounded-md font-bold sm:border-none`}
            key={letter}
          >
            {letter}
          </m.button>
        );
      })}
      {specialKey}
    </>
  );
};

const Keyboard: React.FC<KeyboardProps> = ({
  disabled = true,
  ...props
}: KeyboardProps) => {
  const topRow = "QWERTYUIOP";
  const middleRow = "ASDFGHJKL";
  const bottomRow = "ZXCVBNM";
  return (
    <div className="flex h-56 w-full flex-col items-center gap-1 md:h-fit">
      <div className="flex h-1/3 w-full justify-center gap-1">
        <KeyboardRow
          handleKeyBoardLogic={props.handleKeyBoardLogic}
          matches={props.matches}
          letters={topRow}
          disabled={disabled}
        />
      </div>
      <div className="flex h-1/3 w-full justify-center gap-1">
        <KeyboardRow
          handleKeyBoardLogic={props.handleKeyBoardLogic}
          matches={props.matches}
          letters={middleRow}
          disabled={disabled}
          specialKey={
            <button
              onClick={() => props.handleKeyBoardLogic("Backspace")}
              className={`hidden aspect-square items-center justify-center rounded-md bg-neutral-200 font-bold sm:visible sm:flex sm:w-10`}
            >
              <Image
                className={`${
                  disabled ? "cursor-not-allowed" : "cursor-pointer"
                } `}
                width={20}
                height={20}
                src={
                  "https://utfs.io/f/e8LGKadgGfdISbCQ3VBL1A7qyKpf45WPivbGZs2ItcuQgrmR"
                }
                alt="Delete svg"
                unoptimized
              />
            </button>
          }
        />
      </div>
      <div className="flex h-1/3 w-full justify-center gap-1">
        <KeyboardRow
          handleKeyBoardLogic={props.handleKeyBoardLogic}
          matches={props.matches}
          letters={bottomRow}
          disabled={disabled}
          specialKey={
            <button
              onClick={() => props.handleKeyBoardLogic("Enter")}
              className={`${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              } hidden cursor-pointer items-center justify-center rounded-md bg-neutral-200 px-1 font-bold sm:visible sm:flex`}
            >
              ENTER
            </button>
          }
        />
      </div>
      <div className="sm:invisibile visible mt-3 flex w-full justify-around text-center text-lg font-semibold">
        <button
          onClick={() => props.handleKeyBoardLogic("Enter")}
          className="h-12 w-1/3 rounded-md border-2 border-neutral-700 text-center sm:hidden"
        >
          Enter
        </button>
        <button
          onClick={() => props.handleKeyBoardLogic("Backspace")}
          className="h-12 w-1/3 rounded-md border-2 border-neutral-700 text-center sm:hidden"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
